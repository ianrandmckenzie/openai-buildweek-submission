use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq)]
pub struct SyncRecord {
    pub id: String,
    pub updated_at: i64,
    pub deleted_at: Option<i64>,
    pub synced_at: Option<i64>,
}

#[derive(Clone, Debug, PartialEq)]
pub enum Winner { Local, Remote }

pub fn newest_record(local: &SyncRecord, remote: &SyncRecord) -> Winner {
    if local.updated_at >= remote.updated_at { Winner::Local } else { Winner::Remote }
}

pub fn reconcile(local: &[SyncRecord], remote: &[SyncRecord]) -> Vec<SyncRecord> {
    let mut result = local.to_vec();
    for candidate in remote {
        match result.iter().position(|record| record.id == candidate.id) {
            Some(index) if newest_record(&result[index], candidate) == Winner::Remote => result[index] = candidate.clone(),
            Some(_) => {},
            None => result.push(candidate.clone()),
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    fn record(id: &str, updated_at: i64, deleted_at: Option<i64>) -> SyncRecord { SyncRecord { id: id.into(), updated_at, deleted_at, synced_at: None } }

    #[test]
    fn newest_timestamp_wins_and_equal_timestamps_are_local() {
        assert_eq!(newest_record(&record("a", 2, None), &record("a", 1, None)), Winner::Local);
        assert_eq!(newest_record(&record("a", 1, None), &record("a", 2, None)), Winner::Remote);
        assert_eq!(newest_record(&record("a", 1, None), &record("a", 1, Some(1))), Winner::Local);
    }

    #[test]
    fn tombstones_are_preserved_when_newer() {
        let merged = reconcile(&[record("a", 1, None)], &[record("a", 2, Some(2))]);
        assert_eq!(merged[0].deleted_at, Some(2));
    }
}
