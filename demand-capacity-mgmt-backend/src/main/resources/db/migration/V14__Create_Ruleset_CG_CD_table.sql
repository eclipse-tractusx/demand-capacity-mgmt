SET SEARCH_PATH TO PUBLIC;

CREATE TABLE Capacity_Group_Ruleset (
  capacity_group_id uuid primary key,
  ruled_percentage varchar(500) not null
);

CREATE TABLE Company_Ruleset (
  company_id uuid primary key,
  ruled_percentage varchar(500) not null
);
