use chrono;
use chrono::prelude::*;
use diesel::prelude::*;

#[derive(Queryable, Serialize)]
pub struct Meal {
    pub id: i32,
    pub name: String,
    pub time: NaiveDateTime,
}
