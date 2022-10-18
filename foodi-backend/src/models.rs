use chrono::NaiveDateTime;
use rocket::serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqliteRow, FromRow, Row};

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Meal {
    #[serde(skip_deserializing, skip_serializing_if = "Option::is_none")]
    pub id: Option<i64>,
    pub name: String,
    #[serde(skip_deserializing, skip_serializing_if = "Option::is_none")]
    pub time: Option<NaiveDateTime>,
}

impl FromRow<'_, SqliteRow> for Meal {
    fn from_row(row: &SqliteRow) -> sqlx::Result<Self> {
        Ok(Self {
            id: Some(row.try_get("id")?),
            name: row.try_get("name")?,
            time: row.try_get("time")?,
        })
    }
}
