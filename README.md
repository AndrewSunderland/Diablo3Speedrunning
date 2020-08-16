#Diablo 3 Speedrunning

Summary of Feedback:

We received feedback about the lack of depth and detail in the outline of the project as well ass the specific entities and what they are and do.  We also received feedback about the interface, some leftover templating in the Data Manipulation Queries SQL file and updating and deleting on cascade for the Act_Runs table.  Finally, we received feedback on the ID sections in the tables and formatting clarifications for Act_Runs as well as more information on the home page.

Actions based on feedback:

We decided to improve the overview by going more in depth on the problem the website is solving by having a database in the back end. We also decided to go into more detail as to what the point of the whole website is for overall. We also went into more detail in the outline describing what the specific entities do and are for with information about the game, that the website is based off. Finally, we went into more detail about the specific entity Act_Runs as this is a very important entity that the entire website is based off. 

We cleaned up the interface a little bit and removed the additional leftovers from the template in the Data Manipulation Queries SQL file.  We also took the suggestion and added “ON DELETE CASCADE ON UPDATE CASCADE” to each of the foreign keys in the Act_Runs table so that it gets updated with any deletions or updates.

We went ahead and removed the IDs sections of each of the tables from public view as they are not necessary and shouldn’t be able to be edited.  We also added format clarifications for the date and time fields when entering an Act_Run so that the user knows what format to enter the date and time in.  

We spruced up the Main page with additional info as well as updating the color theme of the navigation bar at the top.



Overview:

In the world of video gamers there is an upper echelon of elite players who strive to be the best amongst the rest.  With sports, this can be determined with tournaments and number of wins and some kinds of video games can achieve the same determination with tournaments and such.  This is a specific category that has developed its own area of recognition known as speed running.  Speed running is the act of playing through a video game as fast as a person possibly can and timing the whole experience.  The people with the best time in a specific video game can be considered the best in the world.  For our site we are focusing on a specific video game called Diablo 3.  The video game Diablo 3 consists of 5 acts or sections each of which can take a different amount of time to complete. We seek to implement a database which records all completion times for each act of the game. More specifically, the database records the player who completed the act, the character class used by the player, the platform on which the game was played, the time taken to complete the act, and the date the act was completed by the player, for each act of the game. These relationships are captured in a table of Act-Runs, particular game events consisting of a player completing a particular act in the game, with foreign keys to other tables which store data for the entities which stand in these relationships.  The entire point of this database is to take these act runs and rank them based on the time it took to complete them with the best time being at the top.  This will help determine who is the best player at completing that specific act of the game.  This will help solve the problem of finding out who is the best speed runner of Diablo 3.


Database Outline

Entities:

•	Players: Records the details of the players who have submitted their times.  These players will be the ones who have completed a specific run of an act and will be ranked by who has the fastest time.

o	player_id:  int, auto_increment, unique, not NULL, PK

o	player_name: varchar, not NULL

o	Relationship: a 1:M relationship between Players and Act_Runs is implemented with player_id as a FK inside of Act_Runs, a M:M relationship between Players and Acts with Act_Runs acting as a relationship table between Players and Acts.

•	Acts: Records the details of the acts in the game.  There are 5 acts in the game, and this helps us differentiate between them as different acts take different amounts of time to complete.

o	act_id: int, auto_increment, unique, not NULL, PK

o	act_name: varchar, not NULL

o	Relationships: a 1:M between Acts and Act_Runs is implemented with act_id as a FK inside Act_Runs, a M:M relationship between Acts and Players with Act_Runs acting as a relationship table between them.

•	Classes: Records the details of the classes in the game.  There are several character classes in the game that a player can play as and while it shouldn’t affect the time of the run by a lot, it can make a difference.

o	class_id: int, auto_increment, unique, not NULL, PK

o	class_name: varchar, not NULL

o	Relationship: a 1:M between Classes and Act_Runs is implemented with class_id as a FK inside of Act_Runs.

•	Platforms: Records the details of the platforms the game is played on.  Diablo 3 can be played on a bunch of different systems and this won’t affect the time of the run.  This will allow players to see who plays on the same system as them.

o	platform_id: int, auto_increment, unique, not NULL, PK

o	platform_name: varchar, not NULL

o	Relationship: a 1:M between Platforms and Act_Runs is implemented with platform_id as a FK inside of Act_Runs.

•	Act_Runs: An Act_Run entity is a concrete event with the following attributes: a single player who is the unique participant in the event, a game level or environment type called an Act, a time which represents the duration of the Act_Run event, the character class type an instance of which the player used to complete the event, a platform on which the game event took place (e.g. XBOX One, PlayStation 4, PC …), and a date on which the Act_Run event took place.

o	act_runs_id: int, auto_increment, unique, not NULL, PK

o	player_id: int, not NULL, FK

o	act_id: int, not NULL, FK

o	time: time, not NULL

o	class_id: int, not NULL, FK

o	platform_id: int, FK

o	date: date, not NULL

o	Relationships:

	Every player participates in 0 or more act runs, yet every act run is participated in by exactly one player. Thus, a 1:M relationship between Players and Act_Runs is implemented with player_id as a FK inside of Act_Runs.

	Every act type of the game is instantiated by 0 or more act run events, yet every act run event will instantiate exactly one act type. Thus, a 1:M between Acts and Act_Runs is implemented with act_id as a FK inside Act_Runs.

	 Every character class is used in 0 or more act runs, yet every act run is completed by a player using exactly one character class. Thus, a 1:M between Classes and Act_Runs is implemented with class_id as a FK inside of Act_Runs.

	Every platform is used in 0 or more act runs, yet every act run is completed by a player using exactly one platform. Thus, a 1:M between platforms and Act_Runs is implemented with platform_id as a FK inside of Act_Runs.

