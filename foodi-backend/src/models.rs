use crate::schema::meals;
use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Serialize)]
pub struct Meal {
    pub id: i32,
    pub name: String,
    pub time: NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[table_name = "meals"]
pub struct NewMeal {
    pub name: String,
    pub time: NaiveDateTime,
}
