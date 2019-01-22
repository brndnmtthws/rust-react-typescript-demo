use crate::schema::meals;
use chrono::NaiveDateTime;

#[derive(Queryable, Serialize)]
pub struct Meal {
    pub id: i32,
    pub name: String,
    pub time: NaiveDateTime,
}

#[derive(AsChangeset, Insertable, Deserialize)]
#[table_name = "meals"]
pub struct NewMeal {
    pub name: String,
    pub time: NaiveDateTime,
}
