-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: io-db-dev-do-user-9001867-0.b.db.ondigitalocean.com    Database: korepetycjedb
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e1028365-91a4-11eb-aee2-1e8f33fc0ea6:1-4432';

--
-- Table structure for table `advertisement`
--

DROP TABLE IF EXISTS `advertisement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advertisement` (
  `ad_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `content` text COLLATE utf8_polish_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `view_count` int unsigned NOT NULL DEFAULT '0',
  `is_accepted` bit(1) NOT NULL DEFAULT b'0',
  `class_id` int unsigned NOT NULL,
  `type_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`ad_id`),
  UNIQUE KEY `ad_id_UNIQUE` (`ad_id`),
  KEY `fk_advertisement_class1_idx` (`class_id`),
  KEY `fk_advertisement_advertisement_type1_idx` (`type_id`),
  KEY `fk_advertisement_user1_idx` (`user_id`),
  CONSTRAINT `fk_advertisement_advertisement_type1` FOREIGN KEY (`type_id`) REFERENCES `advertisement_type` (`type_id`),
  CONSTRAINT `fk_advertisement_class1` FOREIGN KEY (`class_id`) REFERENCES `classroom` (`class_id`),
  CONSTRAINT `fk_advertisement_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advertisement`
--

LOCK TABLES `advertisement` WRITE;
/*!40000 ALTER TABLE `advertisement` DISABLE KEYS */;
INSERT INTO `advertisement` VALUES (1,'first_ad_title','first_ad_content',100.00,'2021-04-20 21:00:00',20,_binary '',1,1,1),(2,'second_ad_title','second_ad_content',200.00,'2021-04-21 00:00:00',32,_binary '\0',2,2,2),(3,'third_ad_title','third_ad_content',300.00,'2022-04-20 21:00:00',70,_binary '\0',3,3,3);
/*!40000 ALTER TABLE `advertisement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advertisement_type`
--

DROP TABLE IF EXISTS `advertisement_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advertisement_type` (
  `type_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_polish_ci NOT NULL,
  PRIMARY KEY (`type_id`),
  UNIQUE KEY `type_id_UNIQUE` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advertisement_type`
--

LOCK TABLES `advertisement_type` WRITE;
/*!40000 ALTER TABLE `advertisement_type` DISABLE KEYS */;
INSERT INTO `advertisement_type` VALUES (1,'first_type'),(2,'second_type'),(3,'third_type');
/*!40000 ALTER TABLE `advertisement_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `callendar`
--

DROP TABLE IF EXISTS `callendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `callendar` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `weekday` int unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_callendar_user1_idx` (`user_id`),
  CONSTRAINT `fk_callendar_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callendar`
--

LOCK TABLES `callendar` WRITE;
/*!40000 ALTER TABLE `callendar` DISABLE KEYS */;
INSERT INTO `callendar` VALUES (1,'17:00:00','18:00:00',5,'first_calendar_title',1),(2,'14:30:00','15:30:00',4,'second_calendar_title',2),(3,'15:45:00','17:15:00',3,'third_calendar_title',3);
/*!40000 ALTER TABLE `callendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `class_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  PRIMARY KEY (`class_id`),
  UNIQUE KEY `class_id_UNIQUE` (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom`
--

LOCK TABLES `classroom` WRITE;
/*!40000 ALTER TABLE `classroom` DISABLE KEYS */;
INSERT INTO `classroom` VALUES (1,'first_class'),(2,'second_class'),(3,'third_class');
/*!40000 ALTER TABLE `classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow` (
  `follow_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_user_id` int unsigned NOT NULL,
  `advertisement_ad_id` int unsigned NOT NULL,
  PRIMARY KEY (`follow_id`),
  UNIQUE KEY `follow_id_UNIQUE` (`follow_id`),
  KEY `fk_follow_user1_idx` (`user_user_id`),
  KEY `fk_follow_advertisement1_idx` (`advertisement_ad_id`),
  CONSTRAINT `fk_follow_advertisement1` FOREIGN KEY (`advertisement_ad_id`) REFERENCES `advertisement` (`ad_id`),
  CONSTRAINT `fk_follow_user1` FOREIGN KEY (`user_user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
INSERT INTO `follow` VALUES (1,1,1),(2,2,2),(3,3,3);
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `nickname` varchar(45) COLLATE utf8_polish_ci NOT NULL,
  `name` varchar(45) COLLATE utf8_polish_ci NOT NULL,
  `surname` varchar(45) COLLATE utf8_polish_ci NOT NULL,
  `email` varchar(45) COLLATE utf8_polish_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8_polish_ci DEFAULT NULL,
  `password` char(60) COLLATE utf8_polish_ci NOT NULL,
  `is_email_confirmed` bit(1) NOT NULL DEFAULT b'0',
  `register_token` varchar(45) COLLATE utf8_polish_ci NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `facebook_url` varchar(255) COLLATE utf8_polish_ci DEFAULT NULL,
  `phone_number` varchar(12) COLLATE utf8_polish_ci DEFAULT NULL,
  `user_type` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `facebook_url_UNIQUE` (`facebook_url`),
  KEY `fk_user_user_type_idx` (`user_type`),
  CONSTRAINT `fk_user_user_type` FOREIGN KEY (`user_type`) REFERENCES `user_type` (`usertype_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'first_nickname','first_name','first_surname','first_email','first_avatar','abcde1234',_binary '\0','first_token','2023-03-20 21:00:00','first_url','first_number',1),(2,'second_nickname','second_name','second_surname','second_email','second_avatar','abcde12345',_binary '\0','second_token','2021-02-20 21:00:00','second_url','second_num',2),(3,'third_nickname','third_name','third_surname','third_email','third_avatar','abcde123456',_binary '\0','third_token','2021-04-22 00:00:00','third_url','third_number',3),(4,'fourth_nickname','fourth_name','fourth_surname','fourth_email','fourth_avatar','abcde1234567',_binary '\0','fourth_token','2020-01-12 11:37:59','fourth_url','111222333',3),(5,'test','test1','test1','test1@test1.pl',NULL,'$2a$10$pIT3zxpAd4b7ZFwlZToMP.zfp1YC1xysldpMOoDXXxyt8H4cFqcwW',_binary '\0','aLGHJij7/WMGE9Y67qghnB0mwUU=','2021-05-09 18:09:37',NULL,NULL,2),(6,'test2','test2','test2','test2@test2.pl',NULL,'$2a$10$oJ3lzbo4404o7WsG9Qvg.en5uqyTGVd1FtVL/WbZ8hkB38ogSh2.e',_binary '\0','j4/IVc47jmgjQfmdb5ZjmkaOj+k=','2021-05-09 18:10:55',NULL,NULL,2),(7,'test3','test3','test3','test3@test3.pl',NULL,'$2a$10$raFYW2kWNmz7XMzbjDNnxOO0l277X6K2ZPrGZVQUIoXFaa4CCDkb.',_binary '\0','uLx05kQNrnsRTN+1zsIRyJW/70c=','2021-05-09 21:59:23',NULL,NULL,2),(19,'testujemail','Hubert','Pięta','shress24@gmail.com',NULL,'$2a$10$IipSfRYzutD9jkL89dFi5uCD2rdj3zD0XJrSpp90Idie.thSWrqQG',_binary '','IwB3HSpb_OwCOXXv..3nO5UEU2nyM40H9sAaFLgdF5ZPN','2021-05-10 20:15:48',NULL,NULL,2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_rating`
--

DROP TABLE IF EXISTS `user_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_rating` (
  `rating_id` int unsigned NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8_polish_ci NOT NULL,
  `rating_number` int unsigned NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sender_id` int unsigned NOT NULL,
  `recipent_id` int unsigned NOT NULL,
  PRIMARY KEY (`rating_id`),
  UNIQUE KEY `rating_id_UNIQUE` (`rating_id`),
  KEY `fk_user_rating_user1_idx` (`sender_id`),
  KEY `fk_user_rating_user2_idx` (`recipent_id`),
  CONSTRAINT `fk_user_rating_user1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `fk_user_rating_user2` FOREIGN KEY (`recipent_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_rating`
--

LOCK TABLES `user_rating` WRITE;
/*!40000 ALTER TABLE `user_rating` DISABLE KEYS */;
INSERT INTO `user_rating` VALUES (1,'first_rate_content',1,'2011-04-20 21:00:00',1,1),(2,'second_rate_content',2,'2012-04-20 21:00:00',2,2),(3,'third_rate_content',3,'2013-04-20 21:00:00',3,3);
/*!40000 ALTER TABLE `user_rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `usertype_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_polish_ci NOT NULL,
  PRIMARY KEY (`usertype_id`),
  UNIQUE KEY `usertype_id_UNIQUE` (`usertype_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (1,'admin'),(2,'szukający'),(3,'wystawiający');
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-10 22:19:22