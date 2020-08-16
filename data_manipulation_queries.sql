-- get all platforms names and their ids for the Platforms Page
SELECT id, name FROM Platforms

-- get a single platform's data for the Update Platform form
SELECT id, name FROM Platforms WHERE id = :platform_id_from_Platforms_page

-- get all players names and their ids for the Players page
SELECT id, name FROM Players

-- get a single player's data for the Update Player form
SELECT id, name FROM Players WHERE id = :Player_id_from_Players_page

-- get all classes names and their ids for the Classes page
SELECT id, name FROM Classes

-- get a single class's data for the Update Class form
SELECT id, name FROM Classes WHERE id = :Classes_id_from_Classes_page

-- get all acts names and their ids for the Acts page
SELECT id, name FROM Acts

-- get a single act's data for the Update Acts form
SELECT id, name FROM Acts WHERE id = :Acts_id_from_Acts_page

-- get all act_run ids, player usernames, acts, times, classes, platforms, and dates for the Act_Runs page
SELECT a.id, player.name AS "Player Username", act.name AS "Act" , time AS "Time", class.name AS "Class", pform.name AS "Platform", date AS "Date"
FROM Act_Runs a INNER JOIN Players player ON player.id = a.player_id 
INNER JOIN Acts act ON act.id = a.act_id INNER JOIN Classes class ON class.id = a.class_id 
LEFT JOIN Platforms pform ON pform.id = a.platform_id;

-- get a single act run's data for the Update Act_Runs form
SELECT a.id, player.name AS "Player Username", act.name AS "Act" , time AS "Time", class.name AS "Class", pform.name AS "Platform", date AS "Date"
FROM Act_Runs a INNER JOIN Players player ON player.id = a.player_id 
INNER JOIN Acts act ON act.id = a.act_id INNER JOIN Classes class ON class.id = a.class_id 
LEFT JOIN Platforms pform ON pform.id = a.platform_id WHERE a.id = :Act_Runs_id_from_Act_Runs_page;


-- add a new platform
INSERT INTO Platforms (name) VALUES (:nameInput)

-- add a new player
INSERT INTO Players (name) VALUES (:nameInput)

-- add a new class
INSERT INTO Classes (name) VALUES (:nameInput)

-- add a new act
INSERT INTO Acts (name) VALUES (:nameInput)

-- add a new act_run
INSERT INTO Act_Runs (player_id, act_id, time, class_id, platform_id, date) 
VALUES (:player_id_from_dropdown_Input, :act_id_from_dropdown_Input, :timeInput, :class_id_from_dropdown_Input, :platform_id_from_dropdown_Input, :dateInput)


-- update a platforms's data based on submission of the Update Platform form 
UPDATE Platforms SET name = :nameInput WHERE id= :platform_ID_from_the_update_form

-- update a player's data based on submission of the Update Player form 
UPDATE Player SET name = :nameInput WHERE id= :player_ID_from_the_update_form

-- update a class's data based on submission of the Update Class form 
UPDATE Classes SET name = :nameInput WHERE id= :class_ID_from_the_update_form

-- update an act's data based on submission of the Update Act form 
UPDATE Acts SET name = :nameInput WHERE id= :act_ID_from_the_update_form

-- update an act_run's data based on submission of the Update Act_Run form 
UPDATE Act_Runs SET player_id = :player_id_from_dropdown_Input, act_id = :act_id_from_dropdown_Input, time = :timeInput, 
class_id = :class_id_from_dropdown_Input, platform_id = :platform_id_from_dropdown_Input, date = :dateInput WHERE id= :act_run_ID_from_the_update_form


-- delete a platform
DELETE FROM Platforms WHERE id = :platform_id_from_Platforms_page

-- delete a player
DELETE FROM Players WHERE id = :player_id_from_Players_page

-- delete a class
DELETE FROM Classes WHERE id = :class_id_from_Classes_page

-- delete an act
DELETE FROM Acts WHERE id = :act_id_from_Acts_page

-- delete an act_run
DELETE FROM Act_Runs WHERE id = :act_run_id_from_Act_Runs_page

-- delete a character
DELETE FROM bsg_people WHERE id = :character_ID_selected_from_browse_character_page
