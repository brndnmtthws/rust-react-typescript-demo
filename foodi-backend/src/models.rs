use crate::schema::meals;
use chrono::NaiveDateTime;

#[derive(Queryable, Serialize)]
pub struct Meal {
    pub id: i32,
    pub name: String,
    pub time: NaiveDateTime,
}

mod date_format {
    use chrono::NaiveDateTime;
    use serde::{self, Deserialize, Deserializer};

    const FORMAT1: &str = "%Y-%m-%dT%H:%M:%S";
    const FORMAT2: &str = "%Y-%m-%dT%H:%M:%S%.3f";
    const FORMAT3: &str = "%Y-%m-%dT%H:%M:%S%.3fZ";

    pub fn deserialize<'de, D>(deserializer: D) -> Result<NaiveDateTime, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;

        let _: Result<NaiveDateTime, D::Error> =
            match NaiveDateTime::parse_from_str(&s, FORMAT1).map_err(serde::de::Error::custom) {
                Ok(dt) => return Ok(dt),
                Err(err) => Err(err),
            };

        let _: Result<NaiveDateTime, D::Error> =
            match NaiveDateTime::parse_from_str(&s, FORMAT2).map_err(serde::de::Error::custom) {
                Ok(dt) => return Ok(dt),
                Err(err) => Err(err),
            };

        match NaiveDateTime::parse_from_str(&s, FORMAT3).map_err(serde::de::Error::custom) {
            Ok(dt) => Ok(dt),
            Err(err) => Err(err),
        }
    }
}

#[derive(AsChangeset, Insertable, Deserialize)]
#[table_name = "meals"]
pub struct NewMeal {
    pub name: String,
    #[serde(with = "date_format")]
    pub time: NaiveDateTime,
}
