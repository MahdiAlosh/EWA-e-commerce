CREATE TABLE gift_shop (
    ProduktID INT AUTO_INCREMENT PRIMARY KEY,
    Produktcode VARCHAR(50),
    Produkttitel VARCHAR(255),
    PreisBrutto DECIMAL(10, 2),
    Mwstsatz DECIMAL(5, 2),
    Lagerbestand INT,
    BewertungStars DECIMAL(3, 2),
    BewertungCount INT,
    BildURL VARCHAR(255)
);

-- Beispiel-Daten einfügen:
INSERT INTO gift_shop (Produktcode, Produkttitel, PreisBrutto, Mwstsatz, Lagerbestand, BewertungStars, BewertungCount, BildURL)
VALUES
('SOCKS001', 'Black and Gray Athletic Cotton Socks - 6 Pairs', 10.90, 0.07, 100, 4.5, 87, 'athletic-cotton-socks-6-pairs.jpg'),
('BB001', 'Intermediate Size Basketball', 20.95, 0.07, 30, 4.0, 127, 'intermediate-composite-basketball.jpg'),
('TOASTER001', '2 Slot Toaster - Black', 18.99, 0.07, 25, 5.0, 2197, 'black-2-slot-toaster.jpg'),
('BAKESET001', '6-Piece Nonstick, Carbon Steel Oven Bakeware Baking Set', 34.99, 0.07, 75, 4.5, 175, '6-piece-non-stick-baking-set.webp'),
('SUNGLASSES001', 'Round Sunglasses', 15.60, 0.07, 70, 4.5, 30, 'round-sunglasses-black.jpg'),
('CURTAIN001', 'Blackout Curtains Set 4-Pack - Beige', 45.99, 0.07, 130, 4.5, 232, 'blackout-curtain-set-beige.webp'),
('KETTLE001', 'Electric Glass and Steel Hot Tea Water Kettle - 1.7-Liter', 30.74, 0.07, 35, 5.0, 846, 'electric-glass-and-steel-hot-water-kettle.webp'),
('HAT001', 'Straw Lifeguard Sun Hat', 22.00, 0.07, 40, 4.0, 215, 'straw-sunhat.webp'),
('EARRINGS001', 'Sterling Silver Sky Flower Stud Earrings', 17.99, 0.07, 66, 4.5, 52, 'sky-flower-stud-earrings.webp'),
('CONTAINERS001', 'Round Airtight Food Storage Containers - 5 Piece', 28.99, 0.07, 95, 4.0, 126, 'round-airtight-food-storage-containers.jpg');

CREATE TABLE nutzer (
    NutzerID VARCHAR(255) PRIMARY KEY,
    Nutzername VARCHAR(255) UNIQUE NULL,
    Email VARCHAR(255) UNIQUE NULL,
    Passwort VARCHAR(255),
    Rolle BOOLEAN DEFAULT 0
);

-- NULL User Ohne Anmeldung
-- 0 UserAnmeldung
-- 1 Admin

CREATE TABLE bestellung (
    ProduktID INT,
    RechnungID INT,
    Mwstsatz DECIMAL(5, 2),
    PreisBrutto DECIMAL(10, 2),
    Menge INT
);

ALTER TABLE bestellung
ADD PRIMARY KEY (ProduktID, RechnungID);

CREATE TABLE Korb (
    NutzerID VARCHAR(255),
    ProduktID INT,
    Menge INT
);

ALTER TABLE Korb
ADD PRIMARY KEY (NutzerID, ProduktID);

CREATE TABLE rechnung (
    RechnungID INT,
    NutzerID VARCHAR(255),
    Zeit DATETIME,
    Email VARCHAR(255),
    Co VARCHAR(255),
    Adresse VARCHAR(255) NOT NULL,
    Plz VARCHAR(255) NOT NULL,
    Ort VARCHAR(255) NOT NULL,
    PaySession VARCHAR(255)
);


-- Rechnungstabelle anpassen: AUTO_INCREMENT für RechnungID und zusammengesetzten Primärschlüssel hinzufügen
ALTER TABLE rechnung
MODIFY COLUMN RechnungID INT AUTO_INCREMENT,
ADD PRIMARY KEY (RechnungID, PaySession);

-- Fremdschlüssel für die bestellung-Tabelle hinzufügen
ALTER TABLE `bestellung` 
ADD CONSTRAINT `del_bestellung_gift_shop`
FOREIGN KEY (`ProduktID`) REFERENCES `gift_shop`(`ProduktID`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `bestellung` 
ADD CONSTRAINT `del_bestellung_rechnung` 
FOREIGN KEY (`RechnungID`) REFERENCES `rechnung`(`RechnungID`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Fremdschlüssel für die Korb-Tabelle hinzufügen
ALTER TABLE `korb` 
ADD CONSTRAINT `del_korb_gift_shop` 
FOREIGN KEY (`ProduktID`) REFERENCES `gift_shop`(`ProduktID`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `korb` 
ADD CONSTRAINT `del_korb_nutzer` 
FOREIGN KEY (`NutzerID`) REFERENCES `nutzer`(`NutzerID`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Fremdschlüssel für die rechnung-Tabelle hinzufügen
ALTER TABLE `rechnung` 
ADD CONSTRAINT `del_rechnung_nutzer` 
FOREIGN KEY (`NutzerID`) REFERENCES `nutzer`(`NutzerID`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;
