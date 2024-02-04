-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pillpulse
-- ------------------------------------------------------
-- Server version	8.0.32

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

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `medicine_id` int NOT NULL,
  `unit_price` float NOT NULL,
  `discount` float NOT NULL,
  `quantity` int NOT NULL DEFAULT (1),
  `total` float NOT NULL DEFAULT (((`unit_price` * `quantity`) * (1 - `discount`))),
  `x` varchar(10) DEFAULT NULL,
  `y` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_userId` (`user_id`),
  KEY `fk_cart_medicineId` (`medicine_id`),
  CONSTRAINT `fk_cart_medicineId` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`),
  CONSTRAINT `fk_cart_userId` FOREIGN KEY (`user_id`) REFERENCES `pillpulse_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (15,3,4,18,0.05,1,17.1,NULL,NULL),(34,17,18,44.55,0.05,2,84.64,NULL,NULL),(35,17,11,36.77,0.05,1,34.9315,NULL,NULL),(36,17,3,32.4,0.07,1,30.132,NULL,NULL),(37,17,20,169.2,0.05,2,321.48,NULL,NULL),(39,17,116,200,0.07,1,186,NULL,NULL);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medicine_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_likes` (`medicine_id`,`user_id`),
  KEY `fk_likes_userId` (`user_id`),
  CONSTRAINT `fk_likes_medicineId` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`),
  CONSTRAINT `fk_likes_userId` FOREIGN KEY (`user_id`) REFERENCES `pillpulse_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (22,18,17),(21,20,17),(19,23,17),(23,116,17);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `manufacturer` varchar(20) NOT NULL,
  `category` varchar(30) NOT NULL,
  `description` varchar(200) NOT NULL,
  `unit_price` float NOT NULL,
  `discount` float NOT NULL DEFAULT (0.05),
  `available_qty` int NOT NULL,
  `exp_date` datetime NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT (_cp850'active'),
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_name_manu` (`name`,`manufacturer`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES (1,'Dolo','DEF Medications','medicine','Dolo 650mg Strip Of 15 Tablets',28.56,0.05,1200,'2025-12-31 00:00:00','https://cdn01.pharmeasy.in/dam/products/059346/dolo-650mg-strip-of-15-tablets-2-1653986150.jpg?dim=320x320&dpr=1&q=100','active'),(2,'Cofsils','XYZ Pharmaceuticals','medicine','Cofsils Orange Lozenges Strip Of 10',34.65,0.05,120,'2025-12-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I04110/cofsils-orange-lozenges-strip-of-10-2-1669655050.jpg?dim=700x0&dpr=1&q=100','active'),(3,'Koflet-H','ABC Healthcare','medicine','Koflet H Orange Flavour Strip Of 6 Lozenges',32.4,0.07,165,'2025-12-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/100343/koflet-h-orange-flavour-strip-of-6-lozenges-2-1679653351.jpg?dim=700x0&dpr=1&q=100','active'),(4,'Digene','PQR Pharma','medicine','Digene Acidity & Gas Relief Tablets 15s- Mixed Fruit Flavour',22.21,0.05,130,'2025-12-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/272033/digene-acidity-gas-relief-tablets-15s-mixed-fruit-flavour-2-1671740738.jpg?dim=700x0&dpr=1&q=100','active'),(5,'Zincovit','PQR Pharma','medicine','Zincovit Strip Of 15 Tablets (Green)',110,0.06,140,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/188996/zincovit-strip-of-15-tablets-green-2-1702990444.jpg?dim=700x0&dpr=1&q=100','active'),(6,'Nurobion Plus','PQR Pharma','medicine','Neurobion Plus Strip Of 10 Tablets',126.1,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products/122021/neurobion-plus-strip-of-10-tablets-2-1656662066.jpg?dim=700x0&dpr=1&q=100','active'),(7,'Livogen-Z','PQR Pharma','medicine','Livogen Z Captab 15',88.35,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I32380/livogen-z-captab-15s-2-1669710431.jpg?dim=700x0&dpr=1&q=100','active'),(8,'Pan D','PQR Pharma','medicine','Pan D Strip Of 15 Capsules',178.5,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products/I03192/pan-d-strip-of-15-capsules-2-1641535847.jpg?dim=320x320&dpr=1&q=100','active'),(9,'Shelcal','PQR Pharma','medicine','Shelcal 500mg Strip Of 15 Tablets',120.8,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/159115/shelcal-500mg-strip-of-15-tablets-2-1679999355.jpg?dim=700x0&dpr=1&q=100','active'),(10,'Calcimax','PQR Pharma','medicine','Calcimax P Strip Of 15 Tablets',190.44,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I13917/calcimax-p-strip-of-15-tablets-2-1669710266.jpg?dim=700x0&dpr=1&q=100','active'),(11,'Telmikind','PQR Pharma','medicine','Telmikind 40mg Strip Of 10 Tablets',36.77,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products/254917/telmikind-ct-40mg-strip-of-10-tablets-2-1648821132.jpg?dim=320x320&dpr=1&q=100','active'),(12,'Amlokind','PQR Pharma','medicine','Amlokind At 5/50mg Strip Of 15 Tablets',41.69,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products/S37463/amlokind-at-5-50mg-strip-of-15-tablets-1-1641539057.jpg?dim=320x320&dpr=1&q=100','active'),(13,'Liv.52','PQR Pharma','medicine','Himalaya Liv.52 Tablets - 100',159.8,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/105920/himalaya-liv52-tablets-100s-2-1671740901.jpg?dim=700x0&dpr=1&q=100','active'),(14,'Rantac Od','PQR Pharma','medicine','Rantac Od 300mg Strip Of 10 Tablets',61.45,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products/270547/rantac-od-300mg-strip-of-10-tablets-2-1688725478.jpg?dim=320x320&dpr=1&q=100','active'),(15,'Ecosprin','PQR Pharma','medicine','Ecosprin Av 75mg Strip Of 15 Capsules',56.4,0.05,1200,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products/064422/ecosprin-av-75mg-strip-of-15-capsules-1-1641535995.jpg?dim=320x320&dpr=1&q=100','active'),(16,'Liveasy','ABC Healthcare','healthcare','Liveasy Foods Healthy Seed Mix - Blend Of 6 Fibre Rich Healthy Seeds - 200 Gms',188.46,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/E34104/liveasy-foods-healthy-seed-mix-blend-of-6-fibre-rich-healthy-seeds-2-1656420891.jpg?dim=700x0&dpr=1&q=100','active'),(17,'Boroplus','ABC Healthcare','healthcare','Boroplus Antiseptic Cream 40 Ml',75,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/028190/boroplus-antiseptic-cream-40-ml-2-1669634850.jpg?dim=700x0&dpr=1&q=100','active'),(18,'Vicks Vaporub','ABC Healthcare','healthcare','Vicks Vaporub 10ml Relief From Cold Cough Headache And Body Pain',44.55,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/181150/vicks-vaporub-10ml-relief-from-cold-cough-headache-and-body-pain-2-1677525517.jpg?dim=700x0&dpr=1&q=100','active'),(19,'Vaseline Deep Moisture','ABC Healthcare','healthcare','Vaseline Intensive Care Deep Moisture Body Lotion - 600 Ml',543.75,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/O79319/vaseline-intensive-care-deep-moisture-body-lotion-600-ml-2-1671742917.jpg?dim=700x0&dpr=1&q=100','active'),(20,'Amrutanjan','ABC Healthcare','healthcare','Amrutanjan New Maha Strong Pain Balm 50ml',169.2,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/D07856/amrutanjan-new-maha-strong-pain-balm-50ml-2-1697103351.jpg?dim=700x0&dpr=1&q=100','active'),(21,'Colgate','ABC Healthcare','healthcare','Colgate Visible White Sparking Mint Whitening Toothpaste Tube Of 100 G',149,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I12598/colgate-visible-white-sparking-mint-whitening-toothpaste-tube-of-100-g-2-1669710149.jpg?dim=700x0&dpr=1&q=100','active'),(22,'Sensodyne','ABC Healthcare','healthcare','Sensodyne Fresh Mint Toothpaste Tube Of 40 G',84.15,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/222329/sensodyne-fresh-mint-toothpaste-tube-of-40-g-2-1671741808.jpg?dim=700x0&dpr=1&q=100','active'),(23,'Dettol Antiseptic','ABC Healthcare','healthcare','Dettol Antiseptic Disinfectant Liquid, 550ml',235,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I40695/dettol-antiseptic-liquid-bottle-of-550-ml-2-1669710729.jpg?dim=700x0&dpr=1&q=100','active'),(24,'Dettol Handwash','ABC Healthcare','healthcare','Dettol Original Handwash Pump + Free Skincare Refill 200ml + 175ml',96,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I48130/dettol-original-handwash-pump-free-skincare-refill-200ml-175ml-2-1691586274.jpg?dim=700x0&dpr=1&q=100','active'),(25,'Glucometer','ABC Healthcare','devices','Dr. Morepen Gluco One Bg 03 Glucometer Test Strips Box Of 50',602.5,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I05582/dr-morepen-gluco-one-bg-03-glucometer-test-strips-box-of-50-1-1669655233.jpg?dim=700x0&dpr=1&q=100','active'),(26,'Glucometer','XYZ Pharmaceuticals','devices','Accu-Chek Active Glucometer Test Strips Box Of 50',984,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/000665/accu-chek-active-glucometer-test-strips-box-of-50-1-1669655023.jpg?dim=700x0&dpr=1&q=100','active'),(27,'Glucometer','PQR Pharma','devices','Accu-Chek Active Glucometer Kit With Free 10 Strips + Dr Morepen Bp One Bp02 Bp Monitor Combo',1898.98,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/K68237/accu-chek-active-glucometer-kit-with-free-10-strips-dr-morepen-bp-one-bp02-bp-monitor-combo-2-1671742323.jpg?dim=700x0&dpr=1&q=100','active'),(28,'Thermometer','XYZ Pharmaceuticals','devices','Pharmeasy Digital Thermometer',165,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/W16773/pharmeasy-digital-thermometer-2-1700220095.jpg?dim=700x0&dpr=1&q=100','active'),(98,'Thermometer','PQR Pharma','devices','Pharmeasy Infrared Thermometer',659.7,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/B63401/pharmeasy-infrared-thermometer-2-1671745340.jpg?dim=700x0&dpr=1&q=100','active'),(99,'Oximeter','PQR Pharma','devices','Oxysat - Finger Tip Pulse Oximeter With Spo2, Perfusion Index Oleds Display & 18m Warranty, Orange',1429,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/R08890/oxysat-finger-tip-pulse-oximeter-with-spo2-perfusion-index-oleds-display-18m-warranty-orange-2-1690014097.jpg?dim=700x0&dpr=1&q=100','active'),(100,'Nailcutter','ABC Healthcare','devices','Liveasy Essentials Nail Cutter',109.35,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/V36025/liveasy-essentials-nail-cutter-2-1671742475.jpg?dim=700x0&dpr=1&q=100','active'),(101,'Hot Water Bag','ABC Healthcare','devices','Pharmeasy Hot Water Bag - Relieves Pain - Relaxes Sore Muscles - Improves Blood Supply - Blue - 2l',275.51,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/B39499/pharmeasy-hot-water-bag-relieves-pain-relaxes-sore-muscles-improves-blood-supply-blue-2l-2-1671777719.jpg?dim=700x0&dpr=1&q=100','active'),(102,'Thermometer','ABC Healthcare','devices','Control D Thermometer',224.1,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/C59636/control-d-thermometer-1-1654252158.jpg?dim=700x0&dpr=1&q=100','active'),(103,'Coviself','ABC Healthcare','devices','Coviself Covid Self Test Kit',195,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/O70942/coviself-covid-self-test-kit-2-1671742428.jpg?dim=700x0&dpr=1&q=100','active'),(104,'Weighing scale','ABC Healthcare','devices','Omron Hn-289 Weighing Scale',2217,0.05,100,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/V35573/omron-hn-289-weighing-scale-2-1641790916.jpg?dim=700x0&dpr=1&q=100','active'),(105,'Himalaya Face Wash','Himalaya','skincare','Himalaya Purifying Neem Face Wash 150ml',199,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I35289/himalaya-purifying-neem-face-wash-150ml-2-1669710354.jpg','active'),(106,'Nycil Germ Expert','Nycil','skincare','Nycil Germ Expert Cool Herbal Prickly Heat & Cooling Powder 150g',149,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/T84523/nycil-germ-expert-cool-herbal-prickly-heat-cooling-powder-150g-50g-cool-herbal-free-2-1705998834.jpg','active'),(107,'Nivea Body Lotion','Nivea','skincare','Nivea Cocoa Nourish Body Lotion Bottle Of 400 Ml',385,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I40912/nivea-cocoa-nourish-body-lotion-bottle-of-400-ml-2-1679372252.jpg','active'),(108,'Himalaya Baby Powder','Himalaya','skincare','Himalaya Baby Powder Bottle Of 400 G',275.5,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/264339/himalaya-baby-powder-bottle-of-400-g-2-1669655167.jpg','active'),(109,'Anti Fungal Powder','Liveasy','skincare','Liveasy Wellness Anti Fungal Dusting Powder 100gm',97,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/X65262/liveasy-wellness-anti-fungal-dusting-powder-100gm-6.1-1695722171.jpg','active'),(110,'Facial Wipes','Liveasy','skincare','Liveasy Cleansing Aloe Vera Refreshing Lime Facial Wipes 20\'S',60,0.07,1000,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/N65859/liveasy-essentials-cleansing-aloe-vera-refreshing-lime-facial-wipes-20s-2-1697177802.jpg','active'),(111,'Himalaya Baby Lotion','Himalaya','skincare','Himalaya Baby Lotion Bottle Of 200 Ml',168,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/090947/himalaya-baby-lotion-bottle-of-200-ml-2-1669655171.jpg','active'),(112,'Nivea Moisturizer','Nivea','skincare','Nivea Soft Light Moisturizer Of 300 Ml',375,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I40924/nivea-soft-light-moisturizer-of-300-ml-2-1679372254.jpg','active'),(113,'Everyuth Face Wash','Everyuth','skincare','Everyuth Naturals Anti Acne Anti Marks Face Wash 150 Gm',155,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I10543/everyuth-naturals-anti-acne-anti-marks-tulsi-turmeric-face-wash-150-gm-2-1669655467.jpg','active'),(114,'Sebonac Face Wash','Sebonac','skincare','Sebonac Face Wash Tube Of 75 G',275,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I43884/sebonac-face-wash-tube-of-75-g-2-1669711239.jpg','active'),(115,'Tonenglo Face Wash','Tonenglo','skincare','Tonenglo Face Wash Tube Of 100 G',320,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/255436/tonenglo-face-wash-tube-of-100-g-2-1671740990.jpg','active'),(116,'Johnson\'S Baby Powder','Johnson\'S','skincare','Johnson\'S Baby Powder - 200 Gm',200,0.07,550,'2025-08-31 00:00:00','https://cdn01.pharmeasy.in/dam/products_otc/I26782/johnsons-baby-powder-200-gm-2-1669710528.jpg','active');
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `medicine_id` int NOT NULL,
  `unit_price` float NOT NULL,
  `discount` float NOT NULL,
  `quantity` int NOT NULL,
  `total` float NOT NULL DEFAULT (((`unit_price` * `quantity`) * (1 - `discount`))),
  `x` varchar(10) DEFAULT NULL,
  `y` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orderItmes_orderId` (`order_id`),
  CONSTRAINT `fk_orderItmes_orderId` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,48,0.05,2,91.2,NULL,NULL),(2,1,3,22,0.07,1,20.46,NULL,NULL),(3,2,1,48,0.05,2,91.2,NULL,NULL),(4,2,2,10,0.05,4,38,NULL,NULL),(5,3,1,48,0.05,1,45.6,NULL,NULL),(6,3,4,18,0.05,1,17.1,NULL,NULL),(7,4,4,18,0.05,3,51.3,NULL,NULL),(8,4,2,10,0.05,3,28.5,NULL,NULL),(9,5,2,10,0.05,5,47.5,NULL,NULL),(10,5,5,24.5,0.06,10,230.3,NULL,NULL),(11,5,4,18,0.05,5,85.5,NULL,NULL),(12,6,2,10,0.05,5,47.5,NULL,NULL),(13,6,5,24.5,0.06,5,115.15,NULL,NULL),(14,6,4,18,0.05,5,85.5,NULL,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_no` varchar(12) NOT NULL,
  `order_total` float NOT NULL,
  `o_timestamp` datetime NOT NULL DEFAULT (now()),
  `d_timestamp` datetime NOT NULL DEFAULT ((now() + interval 3 day)),
  `order_status` varchar(15) NOT NULL DEFAULT 'ordered',
  `x` varchar(10) DEFAULT NULL,
  `y` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_userId` (`user_id`),
  CONSTRAINT `fk_orders_userId` FOREIGN KEY (`user_id`) REFERENCES `pillpulse_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,'231126-00001',111.66,'2023-11-26 16:04:55','2023-11-29 16:04:55','ordered',NULL,NULL),(2,3,'231127-00002',129.2,'2023-11-27 16:13:07','2023-11-30 16:13:07','ordered',NULL,NULL),(3,3,'231127-00003',62.7,'2023-11-27 16:22:07','2023-11-30 16:22:07','cancelled',NULL,NULL),(4,3,'231127-00004',79.8,'2023-11-27 16:38:57','2023-11-30 16:38:57','cancelled',NULL,NULL),(5,4,'231128-00005',363.3,'2023-11-28 11:40:12','2023-12-01 11:40:12','ordered',NULL,NULL),(6,4,'231128-00006',248.15,'2023-11-28 11:46:19','2023-12-01 11:46:19','delivered',NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pillpulse_users`
--

DROP TABLE IF EXISTS `pillpulse_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pillpulse_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `age` int NOT NULL,
  `email_id` varchar(40) NOT NULL,
  `password` varchar(100) NOT NULL,
  `mob_no` varchar(10) NOT NULL,
  `address` varchar(200) NOT NULL,
  `pincode` varchar(6) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT (_cp850'user'),
  `registeredOn` datetime NOT NULL DEFAULT (now()),
  `status` varchar(10) NOT NULL DEFAULT (_cp850'active'),
  `otp` varchar(10) DEFAULT NULL,
  `y` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_id` (`email_id`),
  UNIQUE KEY `mob_no` (`mob_no`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pillpulse_users`
--

LOCK TABLES `pillpulse_users` WRITE;
/*!40000 ALTER TABLE `pillpulse_users` DISABLE KEYS */;
INSERT INTO `pillpulse_users` VALUES (1,'Mahesh Tikhe',35,'mahesh@gmail.com','mahesh@123','9988778878','Rtn','415612','user','2023-11-26 15:08:05','active',NULL,NULL),(2,'Admin001',48,'medbookingpro@gmail.com','AdminLogin@65','9832629901','To be filled','415612','admin','2023-11-26 15:09:03','active',NULL,NULL),(3,'Tejas Deepak Bandbe',24,'tejasbandbe@gmail.com','$2b$10$ZL9KTQhpusrB1mDXiK7E/OznGSzCPJl442BqoYeUOXie/.KEgwlxG','9823629901','1C Radheya HGS, Ravindra nagar, Kuwarbav, Ratnagiri','415639','user','2023-11-26 15:09:58','active',NULL,NULL),(4,'Janhavi Deepak Bandbe',19,'bandbetejas@gmail.com','Janhavi@123','9860193619','1C Radheya HGS, Ravindra nagar, Kuwarbav, Ratnagiri','415639','user','2023-11-28 10:59:14','active',NULL,NULL),(5,'Yogesh Kolhe',38,'yogesh@gmail.com','Yogesh@123','9090909090','2B Navanirman Appt., Opp. Marina mall, Ratnagiri','415612','delivery','2023-11-28 11:00:34','active',NULL,NULL),(6,'Tejas',38,'tejas@gmail.com','Tejas@123','9666444546','2B Navanirman Appt., Opp. Marina mall, Ratnagiri','415837','user','2024-01-06 14:58:54','active',NULL,NULL),(7,'Tejas2',23,'tejas2@gmail.com','$2b$10$itRyTLtrtosMtwyCoUzwOuhIOD8HiG1rzUF/C6XEXJGqYqoQ80Xx6','2222222222','new address','666555','user','2024-01-08 15:36:06','active',NULL,NULL),(8,'Vendor1',0,'vendor1@gmail.com','$2b$10$wQ5ABOxwU9OByzacD8YDTeCr0ep7HzgWcisvoPeasKRBZTGGOaC6K','2222222221','new address','666555','delivery','2024-01-08 15:43:21','active',NULL,NULL),(9,'Admin#2',0,'admin2@gmail.com','$2b$10$1ksPxblrqkrvcaQiiNXQRe3NzWLH4VZQrx5YcTYviHfUM93uqJgFS','2222222220','-','-','admin','2024-01-08 16:18:51','active',NULL,NULL),(10,'Vendor2',0,'vendor2@gmail.com','$2b$10$FFtfMNvrO3pQ48bakcG79ezdqz/B6ufjK7oCZ/Um642uhzQDF22rG','8888676545','new address','415612','delivery','2024-01-10 12:42:06','active',NULL,NULL),(17,'Tejas Bandbe',24,'bandbetejas65@gmail.com','$2b$10$GdgNFsWJgOmiBuAoj0YEf.hg5OfXuU6zP2pufGBQnO.dw/lFJkyiK','9823629902','1D, Radheya HGS, Ravindra Nagar, Karwanchi wadi road, Kuwarbav, Ratnagiri','415639','user','2024-01-21 11:12:08','active',NULL,NULL);
/*!40000 ALTER TABLE `pillpulse_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-04 10:16:28
