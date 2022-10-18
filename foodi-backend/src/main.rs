use chrono::Utc;
use rocket::fairing::AdHoc;
use rocket::futures::TryFutureExt;
use rocket::response::status::{Created, NoContent};
use rocket::response::Debug;
use rocket::serde::json::{json, Json, Value};
use rocket::{
    catch, catchers, delete, error, fairing, get, launch, post, put, routes, Build, Rocket,
};
use rocket_cors::CorsOptions;
use rocket_db_pools::{Connection, Database};

mod models;

use models::Meal;

type Result<T, E = rocket::response::Debug<sqlx::Error>> = std::result::Result<T, E>;

#[derive(Database)]
#[database("sqlite")]
struct Db(sqlx::SqlitePool);

#[get("/<id>")] // GET /v1/meals/<id>
async fn read(mut db: Connection<Db>, id: i64) -> Option<Json<Meal>> {
    sqlx::query_as::<_, Meal>("SELECT * FROM meals WHERE id = ?")
        .bind(id)
        .fetch_one(&mut *db)
        .map_ok(Json)
        .await
        .ok()
}

#[get("/")] // GET /v1/meals
async fn list(mut db: Connection<Db>) -> Result<Json<Vec<Meal>>> {
    sqlx::query_as::<_, Meal>("SELECT * FROM meals")
        .fetch_all(&mut *db)
        .map_ok(|recs| Ok(Json(recs)))
        .map_err(Debug)
        .await?
}

#[post("/", data = "<meal>")] // POST /v1/meals
async fn create(mut db: Connection<Db>, meal: Json<Meal>) -> Result<Created<Json<Meal>>> {
    sqlx::query_as::<_, Meal>(
        "INSERT INTO meals (name, time) VALUES (?, ?) RETURNING id, name, time",
    )
    .bind(meal.name.clone())
    .bind(meal.time.unwrap_or_else(|| Utc::now().naive_utc()))
    .fetch_one(&mut *db)
    .map_ok(|meal| Created::new(format!("/v1/meals/{}", meal.id.unwrap())).body(Json(meal)))
    .map_err(Debug)
    .await
}

#[put("/<id>", data = "<meal>")] // PUT /v1/meals/<id>
async fn update(mut db: Connection<Db>, id: i64, meal: Json<Meal>) -> Result<Json<Meal>> {
    sqlx::query_as::<_, Meal>(
        "UPDATE meals SET name = ?, time = ? WHERE id = ? RETURNING id, name, time",
    )
    .bind(meal.name.clone())
    .bind(meal.time.unwrap_or_else(|| Utc::now().naive_utc()))
    .bind(id)
    .fetch_one(&mut *db)
    .map_ok(Json)
    .map_err(Debug)
    .await
}

#[delete("/<id>")] // DELETE /v1/meals
async fn delete(mut db: Connection<Db>, id: i64) -> Result<NoContent> {
    sqlx::query("DELETE FROM meals WHERE id = ?")
        .bind(id)
        .fetch_one(&mut *db)
        .await
        .map(|_| NoContent)
        .map_err(Debug)
}

#[catch(404)]
fn not_found() -> Value {
    json!({
        "error": {
            "code": 404,
            "description": "Resource was not found.",
            "reason": "Not Found"
        }
    })
}

#[catch(422)]
fn unprocessable_entity() -> Value {
    json!({
        "error": {
            "code": 422,
            "description": "Unprocessable Entity. The request was well-formed but was unable to be followed due to semantic errors.",
            "reason": "Unprocessable Entity"
        }
    })
}

async fn run_migrations(rocket: Rocket<Build>) -> fairing::Result {
    match Db::fetch(&rocket) {
        Some(db) => match sqlx::migrate!().run(&**db).await {
            Ok(_) => Ok(rocket),
            Err(e) => {
                error!("Failed to initialize SQLx database: {}", e);
                Err(rocket)
            }
        },
        None => Err(rocket),
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(CorsOptions::default().to_cors().unwrap())
        .attach(Db::init())
        .attach(AdHoc::try_on_ignite("SQLx Migrations", run_migrations))
        .register("/", catchers![not_found, unprocessable_entity])
        .mount("/v1/meals", routes![create, read, update, delete, list])
}
