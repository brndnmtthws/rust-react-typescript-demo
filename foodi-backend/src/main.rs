#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate serde_derive;
use rocket::response::content;
use rocket_contrib::json::{Json, JsonValue};
use rocket_cors;
use rocket_cors::{AllowedHeaders, AllowedOrigins, Error};

mod models;
mod schema;

use models::*;

#[derive(Debug, Responder)]
#[response(status = 500, content_type = "json")]
pub struct ResponseError {
    response: content::Json<String>,
}

#[derive(Debug, Responder)]
#[response(status = 404, content_type = "json")]
pub struct ResponseNone {
    response: content::Json<String>,
}

#[database("sqlite")]
struct DbConn(diesel::SqliteConnection);

#[get("/meals/<meal_id>")] // GET /v1/meals/<id>
fn get(conn: DbConn, meal_id: i32) -> Result<content::Json<String>, ResponseNone> {
    use diesel::prelude::*;
    use schema::meals::dsl::*;
    let query_result = meals.filter(id.eq(meal_id)).first::<Meal>(&*conn);

    match query_result {
        Ok(results) => Ok(content::Json(json!(results).to_string())),
        Err(error) => Err(ResponseNone {
            response: content::Json(json!({ "error": error.to_string() }).to_string()),
        }),
    }
}

#[get("/meals")] // GET /v1/meals
fn list(conn: DbConn) -> Result<content::Json<String>, ResponseError> {
    use diesel::prelude::*;
    use schema::meals::dsl::*;

    let query_result = meals.load::<Meal>(&*conn);

    match query_result {
        Ok(results) => Ok(content::Json(json!(results).to_string())),
        Err(error) => Err(ResponseError {
            response: content::Json(json!({ "error": error.to_string() }).to_string()),
        }),
    }
}

#[post("/meals", data = "<new_meal>")] // POST /v1/meals
fn add(conn: DbConn, new_meal: Json<NewMeal>) -> Result<content::Json<String>, ResponseError> {
    use diesel::prelude::*;
    use diesel::result::Error;

    let inserted_meal = conn.transaction::<Meal, Error, _>(|| {
        diesel::insert_into(schema::meals::table)
            .values(&new_meal.0)
            .execute(&*conn)?;

        use schema::meals::dsl::*;

        meals.order(id.desc()).first(&*conn)
    });

    match inserted_meal {
        Ok(meal) => Ok(content::Json(json!(meal).to_string())),
        Err(error) => Err(ResponseError {
            response: content::Json(json!({ "error": error.to_string() }).to_string()),
        }),
    }
}

#[put("/meals/<meal_id>", data = "<new_meal>")] // PUT /v1/meals/<id>
fn update(
    conn: DbConn,
    meal_id: i32,
    new_meal: Json<NewMeal>,
) -> Result<content::Json<String>, ResponseError> {
    use diesel::prelude::*;
    use diesel::result::Error;

    let inserted_meal = conn.transaction::<Meal, Error, _>(|| {
        use crate::schema::meals::columns::id;
        diesel::update(schema::meals::table.filter(id.eq(meal_id)))
            .set(&new_meal.0)
            .execute(&*conn)?;

        schema::meals::table.filter(id.eq(meal_id)).first(&*conn)
    });

    match inserted_meal {
        Ok(meal) => Ok(content::Json(json!(meal).to_string())),
        Err(error) => Err(ResponseError {
            response: content::Json(json!({ "error": error.to_string() }).to_string()),
        }),
    }
}

#[delete("/meals/<meal_id>")] // DELETE /v1/meals
fn delete(conn: DbConn, meal_id: i32) -> Result<content::Json<String>, ResponseError> {
    use diesel::prelude::*;
    use diesel::result::Error;

    let result = conn.transaction::<_, Error, _>(|| {
        use crate::schema::meals::columns::id;
        diesel::delete(schema::meals::table.filter(id.eq(meal_id))).execute(&*conn)?;
        Ok(())
    });

    match result {
        Ok(_) => Ok(content::Json(json!({"result":"gone!"}).to_string())),
        Err(error) => Err(ResponseError {
            response: content::Json(json!({ "error": error.to_string() }).to_string()),
        }),
    }
}

#[catch(404)]
fn not_found() -> JsonValue {
    json!({
        "status": "error",
        "reason": "Resource was not found."
    })
}

#[catch(422)]
fn unprocessable_entity() -> JsonValue {
    json!({
        "status": "error",
        "reason": "Unprocessable Entity. The request was well-formed but was unable to be followed due to semantic errors."
    })
}

fn main() -> Result<(), Error> {
    let cors = rocket_cors::Cors {
        allowed_origins: AllowedOrigins::all(),
        allowed_headers: AllowedHeaders::all(),
        allow_credentials: true,
        ..Default::default()
    };

    rocket::ignite()
        .attach(DbConn::fairing())
        .attach(cors)
        .register(catchers![not_found, unprocessable_entity])
        .mount("/v1", routes![list, add, get, update, delete])
        .launch();

    Ok(())
}
