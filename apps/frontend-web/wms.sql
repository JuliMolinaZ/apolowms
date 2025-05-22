-- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: wms
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('1fe4e906-63eb-451a-a1db-b02397cd2a66','25a625fbcbdac866804d1faafb5e1e3f4873f351f1874362df9950e0ad152a09','2025-03-03 08:42:40.168','20250303084240_revert_role_to_string',NULL,NULL,'2025-03-03 08:42:40.158',1),('2b282180-5aac-4972-bd19-20ca5ccd1659','9596f5b81afcac077ad8629a7b83c1f61b6fad8eaef9f3c8804fe01df9194a38','2025-03-10 01:18:30.138','20250310011830_init',NULL,NULL,'2025-03-10 01:18:30.120',1),('a866c96a-08d8-46c6-be16-ce8a20c543d0','692767c3617d9fdabd1686411dbd281b5505a02760d0b0b22ef89728d1ced913','2025-03-10 07:51:05.573','20250310075105_add_is_online',NULL,NULL,'2025-03-10 07:51:05.570',1),('d745a13b-a9ad-4adc-b73a-d58fb711c62c','4d2b4af26991310c9027e4ece0ab8c0473be2eb1d1b9e38a993060ebe451458f','2025-03-03 08:41:15.002','20250303082917_update_user_model',NULL,NULL,'2025-03-03 08:41:14.966',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Arrival`
--

DROP TABLE IF EXISTS `Arrival`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Arrival` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `carrier` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrivalDate` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Arrival_shipmentId_key` (`shipmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Arrival`
--

LOCK TABLES `Arrival` WRITE;
/*!40000 ALTER TABLE `Arrival` DISABLE KEYS */;
INSERT INTO `Arrival` VALUES (1,'SHIP-001','Transportes S.A.','2025-03-10 01:35:17.715','Received','2025-03-10 01:35:17.716','2025-03-10 01:35:17.716'),(2,'SHIP-002','Logística Express','2025-03-10 01:35:17.715','Delayed','2025-03-10 01:35:17.716','2025-04-15 16:56:33.245'),(3,'SHIP001','Carrier A','2025-04-01 08:00:00.000','Delayed','2025-04-15 00:13:16.135','2025-04-15 16:56:18.555'),(4,'SHIP002','Carrier B','2025-04-02 09:30:00.000','In Transit','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(5,'SHIP003','Carrier C','2025-04-03 10:15:00.000','Delayed','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(6,'SHIP004','Carrier D','2025-04-04 11:00:00.000','In Transit','2025-04-15 00:13:16.135','2025-04-15 14:20:55.802'),(7,'SHIP005','Carrier A','2025-04-05 12:45:00.000','Cancelled','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(8,'SHIP006','Carrier E','2025-04-06 07:30:00.000','Delivered','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(9,'SHIP007','Carrier F','2025-04-07 13:00:00.000','In Transit','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(10,'SHIP008','Carrier B','2025-04-08 14:20:00.000','Delivered','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(11,'SHIP009','Carrier C','2025-04-09 15:10:00.000','Delayed','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(12,'SHIP010','Carrier D','2025-04-10 16:00:00.000','Delivered','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(13,'SHIP011','Carrier E','2025-04-11 17:30:00.000','In Transit','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000'),(14,'SHIP012','Carrier F','2025-04-12 18:15:00.000','Delivered','2025-04-15 00:13:16.135','2025-04-15 00:13:16.000');
/*!40000 ALTER TABLE `Arrival` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Item`
--

DROP TABLE IF EXISTS `Item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double NOT NULL,
  `stock` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Item_sku_key` (`sku`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Item`
--

LOCK TABLES `Item` WRITE;
/*!40000 ALTER TABLE `Item` DISABLE KEYS */;
INSERT INTO `Item` VALUES (2,'SKU-001','Camiseta','Camiseta Blanca',19.99,50,'2025-03-10 01:35:17.718','2025-03-10 14:01:29.559'),(4,'SKU-002','Pantalon','Pantalon Negro',30,15,'2025-03-10 03:46:38.923','2025-04-15 05:27:31.527'),(6,'SKU-003','Chamarra','Chamarra pequeña',20.99,50,'2025-03-10 00:20:10.000','2025-03-10 14:01:29.559'),(7,'SKU-004','Zapatos','Zapatos elegantes',99.99,70,'2025-03-10 00:21:19.000','2025-03-10 14:01:29.559'),(11,'SKU-005','Sudadera','Sudadera grande',15.99,500,'2025-03-10 00:59:10.000','2025-04-15 16:52:37.804'),(12,'SKU-006','Tenis','',100,120,'2025-03-10 09:07:12.000','2025-04-15 16:52:37.804'),(16,'SKU-007','Guantes','Guantes Negros',20,35,'2025-03-10 17:10:41.300','2025-03-10 17:10:41.300'),(17,'SKU-008','Medias','',5,12,'2025-03-10 12:12:07.000','2025-04-15 16:54:52.737');
/*!40000 ALTER TABLE `Item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Location`
--

DROP TABLE IF EXISTS `Location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Location_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Location`
--

LOCK TABLES `Location` WRITE;
/*!40000 ALTER TABLE `Location` DISABLE KEYS */;
INSERT INTO `Location` VALUES (1,'LOC-001','Almacén principal',100,'2025-03-10 01:35:17.715','2025-03-10 01:35:17.715'),(2,'LOC-002','Almacén secundario',50,'2025-03-10 01:35:17.715','2025-03-10 01:35:17.715');
/*!40000 ALTER TABLE `Location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Packing`
--

DROP TABLE IF EXISTS `Packing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Packing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itemsCount` int NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Packing_packageId_key` (`packageId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Packing`
--

LOCK TABLES `Packing` WRITE;
/*!40000 ALTER TABLE `Packing` DISABLE KEYS */;
INSERT INTO `Packing` VALUES (1,'PKG-001',5,'Pending','2025-03-10 01:35:17.714','2025-03-10 01:35:17.714'),(2,'PKG-002',3,'Completed','2025-03-10 01:35:17.714','2025-03-10 01:35:17.714');
/*!40000 ALTER TABLE `Packing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Picking`
--

DROP TABLE IF EXISTS `Picking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Picking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Picking`
--

LOCK TABLES `Picking` WRITE;
/*!40000 ALTER TABLE `Picking` DISABLE KEYS */;
INSERT INTO `Picking` VALUES (1,'ORD-001',10,'2025-03-10 01:35:17.712','2025-03-10 01:35:17.712'),(2,'ORD-002',20,'2025-03-10 01:35:17.712','2025-03-10 01:35:17.712'),(5,'ORD-003',3,'2025-03-10 03:30:43.007','2025-03-10 03:30:43.007');
/*!40000 ALTER TABLE `Picking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Putaway`
--

DROP TABLE IF EXISTS `Putaway`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Putaway` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receiptId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Putaway_receiptId_key` (`receiptId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Putaway`
--

LOCK TABLES `Putaway` WRITE;
/*!40000 ALTER TABLE `Putaway` DISABLE KEYS */;
INSERT INTO `Putaway` VALUES (1,'RCPT-001','LOC-001',25,'2025-03-10 01:35:17.717','2025-03-10 01:35:17.717'),(2,'RCPT-002','LOC-002',15,'2025-03-10 01:35:17.717','2025-03-10 01:35:17.717');
/*!40000 ALTER TABLE `Putaway` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Slotting`
--

DROP TABLE IF EXISTS `Slotting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Slotting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Slotting`
--

LOCK TABLES `Slotting` WRITE;
/*!40000 ALTER TABLE `Slotting` DISABLE KEYS */;
INSERT INTO `Slotting` VALUES (1,'A1','Producto X',50,'2025-03-10 01:35:17.713','2025-03-10 01:35:17.713'),(2,'B2','Producto Y',30,'2025-03-10 01:35:17.713','2025-03-10 01:35:17.713');
/*!40000 ALTER TABLE `Slotting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profileImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isOnline` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'JuliMZ','julimz@gmail.com','$2b$10$jBeN8kEX/bDYDN5GI/n92eWYyaZPUIp1CHeRVmLJoZ8wcWaRDQA.K','3127040645','profileImage-1741567093530-346307621.png','operator',0),(2,'admin','admin@example.com','hashedpassword','1234567890','admin.png','admin',0),(3,'operator','operator@example.com','hashedpassword','0987654321','operator.png','operator',0),(4,'juli','juli@gmail.com','$2b$10$qQ6INGxp70k/MicJzoBIlOZZs31ySDWylS3VFsKwx/c/XYANSYZRO','','profileImage-1741591267335-30234100.png','operator',0),(5,'Usuario','Usuario@default.com','defaultpassword',NULL,'','USER',0);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22  0:22:38
