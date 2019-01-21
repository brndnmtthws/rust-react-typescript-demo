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

mod models;
mod schema;

#[derive(Debug, Responder)]
#[response(status = 500, content_type = "json")]
pub struct ResponseError {
    response: content::Json<String>,
}

#[database("sqlite")]
struct DbConn(diesel::SqliteConnection);

#[get("/meals")] // GET /v1/meals
fn list(conn: DbConn) -> Result<content::Json<String>, ResponseError> {
    use diesel::prelude::*;
    use models::*;
    use schema::meals::dsl::*;

    let results = meals.load::<Meal>(&*conn).expect("Couldn't get meals");
    Ok(content::Json(json!(results).to_string()))
}

#[put("/meals")] // PUT /v1/meals
fn add() -> &'static str {
    "Hello, world!"
}

fn main() {
    rocket::ignite()
        .attach(DbConn::fairing())
        .mount("/v1", routes![list, add])
        .launch();
}
