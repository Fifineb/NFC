<<<<<<< HEAD
=======
SELECT 
    s.id_st,
    s.quantite_actuelle,
    s.matiere_id,
    s.magasin_id,
    m.nom_magasin as magasin_nom,
    m.region_id,
    r.region_id as region_id,  
    r.nom_r as region_nom
FROM stock s
JOIN magasin m ON s.magasin_id = m.id
JOIN region r ON m.region_id = r.region_id; 
-- =============================================================
-- SECTION 1 : TYPES ENUM
-- =============================================================
>>>>>>> cdb999b (listeproduit)

-- Création des types ENUM (à exécuter en premier)
CREATE TYPE statut_matiere AS ENUM ('DISPONIBLE', 'RUPTURE', 'PERIME');
CREATE TYPE statut_alerte AS ENUM ('ACTIVE', 'TRAITEE');
CREATE TYPE statut_commande AS ENUM ('EN_ATTENTE', 'VALIDEE', 'LIVREE', 'ANNULEE');
CREATE TYPE role_utilisateur AS ENUM ('ADMINISTRATEUR', 'GESTIONNAIRE', 'SUPERVISEUR', 'MAGASINIER');
CREATE TYPE statut_utilisateur AS ENUM ('ACTIF', 'INACTIF', 'SUSPENDU');

-- Création de la table Region 
CREATE TABLE Region (
    region_id SERIAL PRIMARY KEY,
    nomr VARCHAR(100),
    description TEXT,
    adresser VARCHAR(255)
);

-- Table Magasin 
CREATE TABLE magasin (
    id SERIAL PRIMARY KEY,
    nom_magasin VARCHAR(255) NOT NULL,  
    adresse TEXT,
    region_id INTEGER REFERENCES Region(region_id)
);


-- Table Matiere_premiere
CREATE TABLE matiere_premiere (
    id_pr SERIAL PRIMARY KEY,
    nom_pr VARCHAR(255) NOT NULL,
    description TEXT,
    seuil_minimal DOUBLE PRECISION NOT NULL,
    unite_mesure VARCHAR(50),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut statut_matiere DEFAULT 'DISPONIBLE',
    actif BOOLEAN DEFAULT true
);

-- Table Alerte
CREATE TABLE alerte (
    id_alerte SERIAL PRIMARY KEY,
    date_alerte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL,
    statut statut_alerte DEFAULT 'ACTIVE',
    matiere_id INTEGER REFERENCES matiere_premiere(id_pr) ON DELETE CASCADE
);

-- Table Fournisseur
CREATE TABLE fournisseur (
    id_f SERIAL PRIMARY KEY,
    raison_sociale VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adresse TEXT,
    telephone VARCHAR(50),
    actif BOOLEAN DEFAULT true
);

-- Table Commande
CREATE TABLE commande (
    id_cm SERIAL PRIMARY KEY,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_livraison_prevue DATE,
    date_livraison_reelle DATE,
    quantite_commandee DOUBLE PRECISION NOT NULL,
    statut statut_commande DEFAULT 'EN_ATTENTE',
    fournisseur_id INTEGER REFERENCES fournisseur(id_f),
    matiere_id INTEGER REFERENCES matiere_premiere(id_pr)
);

-- Table Stock
CREATE TABLE stock (
    id_st SERIAL PRIMARY KEY,
    quantite_actuelle DOUBLE PRECISION NOT NULL DEFAULT 0,
    gisement VARCHAR(255),
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    magasin_id INTEGER REFERENCES magasin(id),
    matiere_id INTEGER REFERENCES matiere_premiere(id_pr),
    UNIQUE(magasin_id, matiere_id)
);

-- Table Utilisateur
CREATE TABLE utilisateur (
    id_user SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    statut statut_utilisateur DEFAULT 'ACTIF',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role role_utilisateur DEFAULT 'MAGASINIER'
);

-- Table Mouvement
CREATE TABLE mouvement (
    id_mouvement SERIAL PRIMARY KEY,
    date_mouvement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantite DOUBLE PRECISION NOT NULL,
    reference_bon VARCHAR(100),
    observation TEXT,
    type_mouvement VARCHAR(50), -- 'ENTREE' ou 'SORTIE'
    stock_id INTEGER REFERENCES stock(id_st),
    utilisateur_id INTEGER REFERENCES utilisateur(id_user)
);

-- Table BonDeConsommation
CREATE TABLE bon_consommation (
    id_bc SERIAL PRIMARY KEY,
    departement VARCHAR(100),
    motif_consommation TEXT,
    mouvement_id INTEGER REFERENCES mouvement(id_mouvement)
);

-- Table BonDeSortie
CREATE TABLE bon_sortie (
    id_bs SERIAL PRIMARY KEY,
    departement VARCHAR(100),
    code_machine VARCHAR(100),
    compte_analytique VARCHAR(100),
    destinataire VARCHAR(100),
    mouvement_id INTEGER REFERENCES mouvement(id_mouvement)
);

-- Table Rapport
CREATE TABLE rapport (
    id_rapport SERIAL PRIMARY KEY,
    type_rapport VARCHAR(100),
    date_debut DATE,
    date_fin DATE,
    montant_total_ht DOUBLE PRECISION,
    montant_net DOUBLE PRECISION,
    taux_tva DOUBLE PRECISION,
    utilisateur_id INTEGER REFERENCES utilisateur(id_user)
);

-- Table Categorie
CREATE TABLE categorie (
    id_categorie SERIAL PRIMARY KEY,
    nom_categorie VARCHAR(255) NOT NULL,
    description TEXT
);

-- Table de liaison Matiere_premiere et Categorie (Many-to-Many)
CREATE TABLE matiere_categorie (
    matiere_id INTEGER REFERENCES matiere_premiere(id_pr),
    categorie_id INTEGER REFERENCES categorie(id_categorie),
    PRIMARY KEY (matiere_id, categorie_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_matiere_statut ON matiere_premiere(statut);
CREATE INDEX idx_commande_statut ON commande(statut);
CREATE INDEX idx_stock_matiere ON stock(matiere_id);
CREATE INDEX idx_mouvement_date ON mouvement(date_mouvement);
CREATE INDEX idx_alerte_matiere ON alerte(matiere_id);
CREATE INDEX idx_commande_fournisseur ON commande(fournisseur_id);
CREATE INDEX idx_stock_magasin ON stock(magasin_id);

-- Fonction pour mettre à jour date_modification
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour matiere_premiere
CREATE TRIGGER update_matiere_modtime
    BEFORE UPDATE ON matiere_premiere
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Trigger pour fournisseur
CREATE TRIGGER update_fournisseur_modtime
    BEFORE UPDATE ON fournisseur
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Données de test

-- Insertion des régions
INSERT INTO Region (nomr, description, adresser) VALUES 
('Unité Centrale', 'Région centrale - Siège principal', 'Alger, Oued smar'),
('Unité Batna', 'Région Est - Unité de production Batna', 'Batna'),
('Unité Mascara', 'Région Ouest - Unité de production Mascara', 'Mascara'),
('Unité Alger', 'Région Nord - Unité logistique Alger', 'Alger, Oued smar');

-- Supprimer les anciennes insertions de magasins
TRUNCATE TABLE magasin CASCADE;
ALTER SEQUENCE magasin_id_seq RESTART WITH 1;

-- Insertion des 16 magasins (4 régions × 4 types de magasins)

-- ========== RÉGION 1 : Unité Centrale (region_id = 1) ==========
INSERT INTO magasin (nom_magasin, adresse, region_id) VALUES
('Magasin Ecoma - Unité Centrale', 'Zone Industrielle Smar, Alger', 1),
('Magasin PDR - Unité Centrale', 'Zone Industrielle Smar, Alger', 1),
('Magasin Matiere Premiere - Unité Centrale', 'Zone Industrielle Smar, Alger', 1),
('Magasin Securite - Unité Centrale', 'Zone Industrielle Smar, Alger', 1);

-- ========== RÉGION 2 : Unité Batna (region_id = 2) ==========
INSERT INTO magasin (nom_magasin, adresse, region_id) VALUES
('Magasin Ecoma - Unité Batna', 'Zone Industrielle Batna', 2),
('Magasin PDR - Unité Batna', 'Zone Industrielle Batna', 2),
('Magasin Matiere Premiere - Unité Batna', 'Zone Industrielle Batna', 2),
('Magasin Securite - Unité Batna', 'Zone Industrielle Batna', 2);

<<<<<<< HEAD
-- ========== RÉGION 3 : Unité Mascara (region_id = 3) ==========
INSERT INTO magasin (nom_magasin, adresse, region_id) VALUES
('Magasin Ecoma - Unité Mascara', 'Zone Industrielle Mascara', 3),
('Magasin PDR - Unité Mascara', 'Zone Industrielle Mascara', 3),
('Magasin Matiere Premiere - Unité Mascara', 'Zone Industrielle Mascara', 3),
('Magasin Securite - Unité Mascara', 'Zone Industrielle Mascara', 3);
=======

-- Fournisseurs
INSERT INTO fournisseur (raison_sociale, email, adresse, telephone, actif) VALUES
('Acier Import SARL', 'contact@acier-import.dz', 'Rouiba', '021556677', true),
('Matières Premières SAS', 'contact@mp-sas.dz', 'Alger Centre', '023456789', true);
>>>>>>> cdb999b (listeproduit)

-- ========== RÉGION 4 : Unité Alger (region_id = 4) ==========
INSERT INTO magasin (nom_magasin, adresse, region_id) VALUES
('Magasin Ecoma - Unité Alger', 'Alger, smar', 4),
('Magasin PDR - Unité Alger', 'Alger, smar', 4),
('Magasin Matiere Premiere - Unité Alger', 'Alger, smar', 4),
('Magasin Securite - Unité Alger', 'Alger,smar', 4);

-- afficher tous les magasins par région
SELECT r.nomr AS region, m.nom_magasin, m.adresse
FROM magasin m
JOIN Region r ON m.region_id = r.region_id
ORDER BY r.region_id, m.id;

-- Insertion des catégories
INSERT INTO categorie (nom_categorie, description) VALUES
('Tôles et Bobines', 'Tôles d''acier pour fabrication bouteilles'),
('Consommables soudage', 'Fils à souder, flux, électrodes'),
('Peintures poudre', 'Peintures époxy en poudre'),
('Encres et sérigraphie', 'Encres, diluants, durcisseurs'),
('Robineterie', 'Robinets, vannes, clapets'),
('Joints et étanchéité', 'Joints toriques, auto-serreurs'),
('Détendeurs', 'Détendeurs, limiteurs, manomètres'),
('Collerettes', 'Collerettes de fixation, bagues'),
('Produits chimiques', 'Huiles, dégraissants, diluants'),
('Métaux', 'Barres laiton, fils zinc, grenaille');

<<<<<<< HEAD
-- =====================================================
-- INSERTION DES MATIÈRES PREMIÈRES
-- =====================================================

-- Tôles et Bobines
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, statut, actif) VALUES
('TOLE BS2 1070 x 2,58 IMPORTATION', 'Tôle d''acier importée pour fabrication bouteilles', 100, 'TO', 'DISPONIBLE', true),
('TOLE BS2 1070 x 2,58 SIDER', 'Tôle d''acier Sider pour fabrication bouteilles', 50, 'TO', 'DISPONIBLE', true),
('TOLE BS2 910 x 3,30 P/FLAN P35 KG IMP', 'Tôle pour flan P35 kg importée', 30, 'TO', 'DISPONIBLE', true),
('TOLE BS2 870 x 3,00 IMPORTATION', 'Tôle pour réservoir', 20, 'TO', 'DISPONIBLE', true),
('TOLE BS2 990 x 3,00 IMPORTATION', 'Tôle dimension 990x3mm', 15, 'TO', 'DISPONIBLE', true),
('TOLE BS2 1100 x 3,30 P/VIROLE P35 KG IMP', 'Tôle pour virole P35 kg', 20, 'TO', 'DISPONIBLE', true),
('FEUILLARD COLLIERS 145x2,5', 'Feuillard pour colliers 145x2.5mm', 30, 'TO', 'DISPONIBLE', true),
('FEUILLARD PIEDS 85x3,00 mm', 'Feuillard pour pieds 85x3mm', 25, 'TO', 'DISPONIBLE', true);

-- Fils à souder et consommables
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, statut, actif) VALUES
('FIL A SOUDER Ø 1 mm', 'Fil à souder diamètre 1mm', 5, 'TO', 'DISPONIBLE', true),
('FIL A SOUDER Ø 2,4 mm', 'Fil à souder diamètre 2.4mm', 5, 'TO', 'DISPONIBLE', true),
('FIL A SOUDER Ø 1,2 mm', 'Fil à souder diamètre 1.2mm', 5, 'TO', 'DISPONIBLE', true),
('FLUX DE SOUDURE', 'Flux de soudure pour soudage', 2, 'TO', 'DISPONIBLE', true);

-- Métaux (Zinc, Laiton)
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, statut, actif) VALUES
('FIL DE ZINC 4,76 mm', 'Fil de zinc diamètre 4.76mm', 5, 'TO', 'DISPONIBLE', true),
('FIL DE ZINC 3,17 mm', 'Fil de zinc diamètre 3.17mm', 5, 'TO', 'DISPONIBLE', true),
('BARRE LAITON Ø14 mm', 'Barre en laiton diamètre 14mm', 2, 'TO', 'DISPONIBLE', true),
('BARRE LAITON Ø16 mm', 'Barre en laiton diamètre 16mm', 2, 'TO', 'DISPONIBLE', true),
('BARRE LAITON Ø25 mm', 'Barre en laiton diamètre 25mm', 2, 'TO', 'DISPONIBLE', true),
('GRENILLE D''ACIER', 'Grenaille d''acier pour grenaillage', 5, 'TO', 'DISPONIBLE', true);

-- Collerettes
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, statut, actif) VALUES
('COLLERETTES P/BAG 11/13 & P35', 'Collerettes pour bouteilles 11/13kg et P35kg', 500, 'PC', 'DISPONIBLE', true),
('COLLERETTES SIRGAZ R60L', 'Collerettes pour bouteilles Sirgaz R60L', 200, 'PC', 'DISPONIBLE', true);

-- Peintures
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, statut, actif) VALUES
('PEINTURE EPOXY BLEUE', 'Peinture époxy bleue en poudre', 2, 'TO', 'DISPONIBLE', true),
('PEINTURE EPOXY NOIRE', 'Peinture époxy noire en poudre', 2, 'TO', 'DISPONIBLE', true),
('PEINTURE EPOXY ORANGE', 'Peinture époxy orange en poudre', 1, 'TO', 'DISPONIBLE', true),
('PEINTURE BLANCHE POUDRE', 'Peinture blanche en poudre', 1, 'TO', 'DISPONIBLE', true);

-- Encres et diluants
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, statut, actif) VALUES
('ENCRE MARABU UVGL122', 'Encre pour sérigraphie', 10, 'PG', 'DISPONIBLE', true),
('ENCRE JAUNE', 'Encre jaune sérigraphie', 15, 'KG', 'DISPONIBLE', true),
('DILUANT GLYFOUR', 'Diluant pour encres', 20, 'PG', 'DISPONIBLE', true),
('DILUANT UVVG', 'Diluant UV pour sérigraphie', 10, 'L', 'DISPONIBLE', true),
('DURCISSER UVEVS', 'Durcisseur UV', 5, 'BTB', 'DISPONIBLE', true),
('HUILE D''EMBOUTISSAGE', 'Huile pour emboutissage', 50, 'L', 'DISPONIBLE', true);

-- Robinets et joints
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, statut, actif) VALUES
('ROBINETS B13/P35 KAPITAL', 'Robinets pour bouteilles B13/P35', 500, 'PC', 'DISPONIBLE', true),
('ROBINET AMOMOLAC', 'Robinets Amomolac', 200, 'PC', 'DISPONIBLE', true),
('JOINTS TORIQUES', 'Joints toriques pour étanchéité', 500, 'CENT', 'DISPONIBLE', true),
('JOINTS AUTO SERRAGE', 'Joints auto-serreurs', 300, 'CENT', 'DISPONIBLE', true),
('LIMITEURS DE DÉBIT', 'Limiteurs de débit', 200, 'CENT', 'DISPONIBLE', true);

-- Insertion de l'utilisateur
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Oussama', 'Admin', 'oussama@gmail.com', 'oussama123456', 'ADMINISTRATEUR');

-- Insertion des stocks 
INSERT INTO stock (quantite_actuelle, gisement, magasin_id, matiere_id) VALUES
(500, 'Entrepôt A - Secteur 1', 1, 1),
(300, 'Entrepôt A - Secteur 2', 1, 2),
(1000, 'Entrepôt B - Secteur 1', 2, 1);

-- Insertion des alertes
INSERT INTO alerte (message, matiere_id) VALUES
('Stock de Fil Zinc bas - seuil critique', 2),
('Stock de Tole en dessous du seuil minimal', 1);

-- Insertion du fournisseur
INSERT INTO fournisseur (raison_sociale, email, adresse, telephone, actif) VALUES
('Acier Import SARL', 'contact@acier-import.dz', 'Zone Industrielle Rouiba', '021 55 66 77', true);

-- Insertion de la commande test
INSERT INTO commande (date_commande, date_livraison_prevue, quantite_commandee, statut, fournisseur_id, matiere_id) VALUES
(CURRENT_TIMESTAMP, CURRENT_DATE + INTERVAL '7 days', 2000, 'EN_ATTENTE', 1, 1);

-- Insertion du mouvement test
INSERT INTO mouvement (date_mouvement, quantite, reference_bon, observation, type_mouvement, stock_id, utilisateur_id) VALUES
(CURRENT_TIMESTAMP, 100, 'BON-001', 'Sortie pour production', 'SORTIE', 1, 1);

-- INSERTION DES MOUVEMENTS RÉCENTS
-- =====================================================
INSERT INTO mouvement (date_mouvement, quantite, reference_bon, observation, type_mouvement, utilisateur_id) VALUES
('2026-02-09', 14.750, 'BON-2026-001', 'Sortie production B13', 'SORTIE', 1),
('2026-02-09', 6.470, 'BON-2026-002', 'Sortie production réservoir', 'SORTIE', 1);

-- =====================================================
-- INSERTION DES BONS DE SORTIE
-- =====================================================
--INSERT INTO bon_sortie (departement, code_machine, compte_analytique, destinataire, mouvement_id) VALUES
--('Production', 'P001', 'ANALY-001', 'Atelier B13', 1),
--('Production', 'P002', 'ANALY-002', 'Atelier Réservoir', 2);



-- =====================================================
-- REQUÊTES DE VÉRIFICATION
-- =====================================================

-- Vérifier le nombre de produits insérés
SELECT COUNT(*) AS total_produits FROM matiere_premiere;

-- Vérifier les stocks
SELECT mp.nom_pr, s.quantite_actuelle, s.gisement, m.nom_magasin
FROM stock s
JOIN matiere_premiere mp ON s.matiere_id = mp.id_pr
JOIN magasin m ON s.magasin_id = m.id
ORDER BY mp.nom_pr;

-- Vérifier les alertes actives
SELECT a.message, mp.nom_pr, a.date_alerte, a.statut
FROM alerte a
JOIN matiere_premiere mp ON a.matiere_id = mp.id_pr
WHERE a.statut = 'ACTIVE';

-- Produits en stock faible
SELECT mp.nom_pr, s.quantite_actuelle, mp.seuil_minimal
FROM stock s
JOIN matiere_premiere mp ON s.matiere_id = mp.id_pr
WHERE s.quantite_actuelle <= mp.seuil_minimal
ORDER BY (s.quantite_actuelle / mp.seuil_minimal) ASC;







-- =====================================================
-- TABLES POUR LES DOCUMENTS DE STOCK
-- =====================================================

-- Table pour les Bons d'Entrée (B.E.)
CREATE TABLE bon_entree (
    id_be SERIAL PRIMARY KEY,
    numero_be VARCHAR(50) NOT NULL UNIQUE,
    date_be DATE NOT NULL,
    code_operation VARCHAR(20),
    provenance VARCHAR(50), -- 'INTERNE' ou 'EXTERNE'
    fournisseur_id INTEGER REFERENCES fournisseur(id_f),
    cob_inst VARCHAR(50),
    observation TEXT,
    statut VARCHAR(20) DEFAULT 'VALIDE',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utilisateur_id INTEGER REFERENCES utilisateur(id_user)
);

-- Lignes du Bon d'Entrée
CREATE TABLE bon_entree_ligne (
    id_ligne SERIAL PRIMARY KEY,
    bon_entree_id INTEGER REFERENCES bon_entree(id_be) ON DELETE CASCADE,
    produit_id INTEGER REFERENCES matiere_premiere(id_pr),
    quantite_conforme DOUBLE PRECISION NOT NULL,
    quantite_refusee DOUBLE PRECISION DEFAULT 0,
    prix_unitaire DOUBLE PRECISION,
    montant DOUBLE PRECISION,
    unite_mesure VARCHAR(10)
);

-- Table pour les Bons de Réception
CREATE TABLE bon_reception (
    id_br SERIAL PRIMARY KEY,
    numero_br VARCHAR(50) NOT NULL UNIQUE,
    date_br DATE NOT NULL,
    numero_dossier VARCHAR(50),
    numero_bon_commande VARCHAR(50),
    numero_facture VARCHAR(50),
    date_facture DATE,
    fournisseur_id INTEGER REFERENCES fournisseur(id_f),
    magasin_id INTEGER REFERENCES magasin(id),
    type_reception VARCHAR(50), -- 'PDR', 'MATIERE_PREMIERE', 'SECURITE', 'ECOMA'
    pays_origine VARCHAR(100),
    montant_ht DOUBLE PRECISION,
    frais_approche DOUBLE PRECISION DEFAULT 0,
    autres_frais DOUBLE PRECISION DEFAULT 0,
    total_tva DOUBLE PRECISION,
    total_ttc DOUBLE PRECISION,
    remise DOUBLE PRECISION DEFAULT 0,
    monnaie VARCHAR(10) DEFAULT 'DZD',
    statut VARCHAR(20) DEFAULT 'EN_ATTENTE',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utilisateur_id INTEGER REFERENCES utilisateur(id_user)
);

-- Lignes du Bon de Réception
CREATE TABLE bon_reception_ligne (
    id_ligne SERIAL PRIMARY KEY,
    bon_reception_id INTEGER REFERENCES bon_reception(id_br) ON DELETE CASCADE,
    code_produit VARCHAR(50),
    designation TEXT,
    unite_mesure VARCHAR(10),
    quantite DOUBLE PRECISION NOT NULL,
    prix_unitaire DOUBLE PRECISION,
    montant_facture DOUBLE PRECISION,
    taux_tva DOUBLE PRECISION,
    cout_achat DOUBLE PRECISION
);

-- Table pour les Demandes d'Achat
CREATE TABLE demande_achat (
    id_da SERIAL PRIMARY KEY,
    numero_dossier VARCHAR(50) NOT NULL UNIQUE,
    date_demande DATE NOT NULL,
    departement VARCHAR(100),
    service VARCHAR(100),
    nature_materiel VARCHAR(50), -- 'PDR', 'EQUIPEMENT', 'CONSOMMABLE'
    destination VARCHAR(200),
    reference_materiel VARCHAR(100),
    fournisseur_propose VARCHAR(200),
    adresse_fournisseur TEXT,
    ville_pays VARCHAR(100),
    delai_souhaite VARCHAR(50),
    urgence BOOLEAN DEFAULT false,
    emetteur VARCHAR(100),
    chef_service VARCHAR(100),
    visa VARCHAR(100),
    statut VARCHAR(20) DEFAULT 'EN_ATTENTE',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utilisateur_id INTEGER REFERENCES utilisateur(id_user)
);

-- Lignes de la Demande d'Achat
CREATE TABLE demande_achat_ligne (
    id_ligne SERIAL PRIMARY KEY,
    demande_achat_id INTEGER REFERENCES demande_achat(id_da) ON DELETE CASCADE,
    poste INTEGER,
    code_article VARCHAR(50),
    designation TEXT,
    quantite INTEGER,
    unite_mesure VARCHAR(10),
    prix_unitaire DOUBLE PRECISION,
    prix_total DOUBLE PRECISION,
    tarif_douanier DOUBLE PRECISION
);

-- Table pour les Fiches de Stock
CREATE TABLE fiche_stock (
    id_fiche SERIAL PRIMARY KEY,
    produit_id INTEGER REFERENCES matiere_premiere(id_pr),
    magasin_id INTEGER REFERENCES magasin(id),
    code_article VARCHAR(50),
    unite_gestion VARCHAR(20),
    seuil_mini DOUBLE PRECISION,
    seuil_secu DOUBLE PRECISION,
    prix_moyen DOUBLE PRECISION,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lignes de la Fiche de Stock (mouvements mensuels)
CREATE TABLE fiche_stock_mouvement (
    id_mouvement SERIAL PRIMARY KEY,
    fiche_stock_id INTEGER REFERENCES fiche_stock(id_fiche) ON DELETE CASCADE,
    date_mouvement DATE NOT NULL,
    numero_piece VARCHAR(50),
    nature VARCHAR(50),
    origine_destination VARCHAR(100),
    quantite_entree DOUBLE PRECISION DEFAULT 0,
    quantite_sortie DOUBLE PRECISION DEFAULT 0,
    stock_resultant DOUBLE PRECISION,
    observation TEXT
);

-- Table pour les statistiques de consommation
CREATE TABLE consommation_annuelle (
    id_consommation SERIAL PRIMARY KEY,
    produit_id INTEGER REFERENCES matiere_premiere(id_pr),
    annee INTEGER NOT NULL,
    janvier DOUBLE PRECISION DEFAULT 0,
    fevrier DOUBLE PRECISION DEFAULT 0,
    mars DOUBLE PRECISION DEFAULT 0,
    avril DOUBLE PRECISION DEFAULT 0,
    mai DOUBLE PRECISION DEFAULT 0,
    juin DOUBLE PRECISION DEFAULT 0,
    juillet DOUBLE PRECISION DEFAULT 0,
    aout DOUBLE PRECISION DEFAULT 0,
    septembre DOUBLE PRECISION DEFAULT 0,
    octobre DOUBLE PRECISION DEFAULT 0,
    novembre DOUBLE PRECISION DEFAULT 0,
    decembre DOUBLE PRECISION DEFAULT 0,
    total_annuel DOUBLE PRECISION,
    moyenne_mensuelle DOUBLE PRECISION,
    UNIQUE(produit_id, annee)
);

-- =====================================================
-- EXEMPLES D'INSERTION (Données test)
-- =====================================================

-- Bon d'Entrée
INSERT INTO bon_entree (numero_be, date_be, code_operation, provenance, fournisseur_id, cob_inst, observation, utilisateur_id) VALUES
('BE-2023-001', '2023-11-01', 'L1L1', 'EXTERNE', 1, 'COB-INST-001', 'Réception normale', 1);

-- Lignes du Bon d'Entrée
INSERT INTO bon_entree_ligne (bon_entree_id, produit_id, quantite_conforme, quantite_refusee, prix_unitaire, montant, unite_mesure) VALUES
(1, 4, 7320.05, 0, 850.00, 6222042.50, 'KG');

-- Bon de Réception PDR
INSERT INTO bon_reception (numero_br, date_br, numero_dossier, numero_facture, fournisseur_id, magasin_id, type_reception, montant_ht, total_ttc, statut, utilisateur_id) VALUES
('BR-2026-001', '2026-01-29', '29/01/2026', 'FACT-2026-001', 1, 2, 'PDR', 50000, 60000, 'VALIDE', 1);

-- Demande d'Achat
INSERT INTO demande_achat (numero_dossier, date_demande, departement, service, nature_materiel, destination, reference_materiel, fournisseur_propose, delai_souhaite, urgence, emetteur, chef_service, visa, utilisateur_id) VALUES
('DA-2026-001', '2026-01-29', 'Technique', 'GAS', 'PDR', 'Atelier MGX', 'poste à souder Manuel', 'Demande locale', 'Vite', true, 'HEUFFEL M.', 'Chef Service', 'HEUFFEL M.', 1);

-- Lignes Demande d'Achat
INSERT INTO demande_achat_ligne (demande_achat_id, poste, code_article, designation, quantite, unite_mesure) VALUES
(1, 1, 'SANTI-001', 'Sanificateur Sécurité Trafics', 1, 'U');

-- Fiche de Stock
INSERT INTO fiche_stock (produit_id, magasin_id, code_article, unite_gestion, seuil_mini, seuil_secu, prix_moyen) VALUES
(5, 2, 'MP000001', 'TO', 100, 50, 850);

-- Mouvement sur fiche de stock
INSERT INTO fiche_stock_mouvement (fiche_stock_id, date_mouvement, numero_piece, nature, origine_destination, quantite_entree, stock_resultant) VALUES
(2, '2023-12-30', '604999', 'KES', '03', 7320.05, 7320.05);

-- Consommation annuelle
INSERT INTO consommation_annuelle (produit_id, annee, janvier, fevrier, mars, total_annuel, moyenne_mensuelle) VALUES
(6, 2024, 500, 600, 550, 1650, 550);

-- =====================================================
-- VUES POUR LES RAPPORTS
-- =====================================================

-- Vue pour les entrées de stock
CREATE VIEW vue_entrees_stock AS
SELECT 
    be.numero_be,
    be.date_be,
    mp.nom_pr AS produit,
    bel.quantite_conforme,
    bel.prix_unitaire,
    bel.montant,
    f.raison_sociale AS fournisseur
FROM bon_entree be
JOIN bon_entree_ligne bel ON be.id_be = bel.bon_entree_id
JOIN matiere_premiere mp ON bel.produit_id = mp.id_pr
LEFT JOIN fournisseur f ON be.fournisseur_id = f.id_f
ORDER BY be.date_be DESC;

-- Vue pour les demandes d'achat urgentes
CREATE VIEW vue_demandes_urgentes AS
SELECT 
    numero_dossier,
    date_demande,
    departement,
    nature_materiel,
    destination,
    delai_souhaite,
    urgence,
    statut
FROM demande_achat
WHERE urgence = true AND statut = 'EN_ATTENTE'
ORDER BY date_demande DESC;

-- =====================================================
-- FONCTION POUR CALCULER LE STOCK APRÈS BON D'ENTRÉE
-- =====================================================
CREATE OR REPLACE FUNCTION update_stock_apres_entree()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le stock
    UPDATE stock 
    SET quantite_actuelle = quantite_actuelle + NEW.quantite_conforme,
        date_mise_a_jour = CURRENT_TIMESTAMP
    WHERE matiere_id = NEW.produit_id 
      AND magasin_id = (SELECT magasin_id FROM bon_entree be WHERE be.id_be = NEW.bon_entree_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mise à jour automatique du stock
CREATE TRIGGER trigger_update_stock_entree
AFTER INSERT ON bon_entree_ligne
FOR EACH ROW
EXECUTE FUNCTION update_stock_apres_entree();
=======
-- Matières premières
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, quantite) VALUES
('Tole', 'BS2 1070*2,58 Importation', 4000, 'TONNES', 500),
('Fil Zinc', 'Fil industriel', 500, 'TONNES', 300),
('PEHD Granulés', 'Polyéthylène haute densité', 1000, 'TONNES', 1500);

-- Associations catégories
INSERT INTO matiere_categorie (matiere_id, categorie_id) VALUES
(1, 1), (2, 1), (3, 2);

-- Stocks
INSERT INTO stock (quantite_actuelle, gisement, magasin_id, matiere_id) VALUES
(500, 'A1', 1, 1),
(300, 'A2', 1, 2),
(1000, 'B1', 2, 1),
(500, 'B2', 2, 3),
(200, 'A3', 1, 3);

-- Alertes
INSERT INTO alerte (message, matiere_id) VALUES
('Stock faible Zinc (300 < seuil 500)', 2),
('Stock Tole critique (1500 < seuil 4000)', 1);

-- Commandes
INSERT INTO commande (date_commande, date_livraison_prevue, quantite_commandee, statut, fournisseur_id, matiere_id, utilisateur_id) VALUES
(CURRENT_TIMESTAMP, CURRENT_DATE + INTERVAL '7 days', 2000, 'EN_ATTENTE', 1, 1, 1),
(CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days', 500, 'VALIDEE', 2, 2, 2);

-- Mouvements
INSERT INTO mouvement (date_mouvement, quantite, reference_bon, observation, type_mouvement, stock_id, utilisateur_id) VALUES
(CURRENT_TIMESTAMP, 100, 'BON-001', 'Réception stock initial', 'ENTREE', 1, 1),
(CURRENT_TIMESTAMP - INTERVAL '3 days', 50, 'BON-002', 'Consommation production', 'CONSOMMATION', 1, 2),
(CURRENT_TIMESTAMP - INTERVAL '2 days', 200, 'BON-003', 'Réception fournisseur', 'ENTREE', 3, 1);

-- Tables enfants
INSERT INTO bon_consommation (id_mouvement, departement, motif_consommation)
SELECT id_mouvement, 'Production', 'Fabrication pièces' FROM mouvement WHERE reference_bon = 'BON-002';

INSERT INTO bon_entree (id_mouvement, num_facture, quantite_conforme, quantite_refusee, prix_unitaire_achat)
SELECT id_mouvement, 'FACT-001', 100, 0, 150.50 FROM mouvement WHERE reference_bon = 'BON-001';

INSERT INTO bon_sortie (id_mouvement, departement, code_machine, compte_analytique, destinataire)
SELECT id_mouvement, 'Atelier', 'MACH-01', 'COMPTA-001', 'Atelier Production' FROM mouvement WHERE reference_bon = 'BON-003';

INSERT INTO commande_achat (id_mouvement, date_livraison_prevue, degre_urgence, prix_total_estime, fournisseur_id)
SELECT id_mouvement, CURRENT_DATE + INTERVAL '10 days', 'URGENT', 5000.00, 1 FROM mouvement WHERE reference_bon = 'BON-003';

-- =============================================================
-- SECTION 7 : VÉRIFICATIONS FINALES
-- =============================================================

-- Afficher les statistiques du dashboard
SELECT * FROM v_dashboard;

-- Afficher les alertes actives
SELECT * FROM v_alertes_actives;

-- Afficher l'état du stock global
SELECT * FROM v_stock_global;

-- Afficher les commandes
SELECT * FROM v_commandes_details;

--afficher les utilisateurs

select * from utilisateurs; 
-- ============================================================
-- 3. INSERTION DES MATIÈRES PREMIÈRES AVEC QUANTITÉ
-- ============================================================

-- Tôles et Bobines
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure, quantite) VALUES
('Tole BS2 1070x2,58 Import', 'Tôle importée 1070x2,58 mm', 4000, 'TONNES', 1813.142),
('Tole BS2 1070x2,58 SIDER', 'Tôle SIDER 1070x2,58 mm', 4000, 'TONNES', 44.350),
('Tole BS2 910x3,30 Flan P35 IMP', 'Tôle flan P35 importée 910x3,30 mm', 4000, 'TONNES', 15.710),
('Tole BS2 1100x3,30 Virole P35 IMP', 'Tôle virole P35 1100x3,30 mm', 4000, 'TONNES', 0),
('Tole BS2 990x3,00 Import', 'Tôle importée 990x3,00 mm', 4000, 'TONNES', 0),
('Tole BS2 990x3,00 SIDER', 'Tôle SIDER 990x3,00 mm', 4000, 'TONNES', 0),
('Tole BS2 870x3,00 Import', 'Tôle importée 870x3,00 mm', 4000, 'TONNES', 12.760),
('Tole BS2 880x2,58 B6 Kg', 'Tôle B6 880x2,58 mm', 4000, 'TONNES', 205.950),
('Tole Acier 4000x3200x9mm', 'Tôle acier épaisse 4000x3200x9mm', 4000, 'TONNES', 489),

-- Feuillards
('Feuillard Pied 85x3mm', 'Feuillard pied 85x3 mm', 500, 'TONNES', 227.136),
('Feuillard Collier 145x2,5mm', 'Feuillard collier 145x2,5 mm', 500, 'TONNES', 144.440),
('Feuillard Collier 145x2,58mm', 'Feuillard collier 145x2,58 mm', 500, 'TONNES', 0),
('Feuillard Pied 70x2,5mm', 'Feuillard pied 70x2,5 mm', 500, 'TONNES', 3.050),
('Feuillard Pied 70x3mm', 'Feuillard pied 70x3 mm', 500, 'TONNES', 9.025),
('Feuillard Pied 85x3 neuves', 'Feuillard pied 85x3 mm (neuf)', 500, 'TONNES', 304.021),
('Feuillard Collier 130x2mm B6', 'Feuillard collier 130x2 mm B6', 500, 'TONNES', 53.960),

-- Collerettes
('Collerettes B13 & P35', 'Collerettes pour modèles B13 et P35', 500, 'TONNES', 5165),
('Collerettes SIRGHAZ', 'Collerettes SIRGHAZ', 500, 'TONNES', 1022),

-- Fil à souder
('Fil à Souder Ø1 mm', 'Fil à souder diamètre 1 mm', 100, 'TONNES', 45.630),
('Fil à Souder Ø1,2 mm', 'Fil à souder diamètre 1,2 mm', 100, 'TONNES', 16.545),
('Fil à Souder Ø1,6 mm', 'Fil à souder diamètre 1,6 mm', 100, 'TONNES', 29.300),
('Fil à Souder Ø2,4 mm', 'Fil à souder diamètre 2,4 mm', 100, 'TONNES', 60.925),
('Fil Electrodes Diam 1mm', 'Électrodes diamètre 1 mm', 100, 'TONNES', 0),
('Fil Electrodes Diam 2,4mm', 'Électrodes diamètre 2,4 mm', 100, 'TONNES', 0),
('Fil à Souder Citerne 3,2mm', 'Fil à souder pour citerne 3,2 mm', 100, 'TONNES', 0),

-- Fil de zinc
('Fil de Zinc Ø4,76 mm', 'Fil de zinc diamètre 4,76 mm', 200, 'TONNES', 53),
('Fil de Zinc Ø3,17 mm', 'Fil de zinc diamètre 3,17 mm', 200, 'TONNES', 90),

-- Laiton
('Barre Laiton Ø14 mm', 'Barre laiton diamètre 14 mm', 100, 'TONNES', 4.838),
('Barre Laiton Ø16 mm', 'Barre laiton diamètre 16 mm', 100, 'TONNES', 12.792),
('Barre Laiton Ø25 mm', 'Barre laiton diamètre 25 mm', 100, 'TONNES', 89.956),

-- Tubes sans soudure
('TSS Ø139,7x5mm (5-6 & 10kg CO2)', 'Tube sans soudure pour bouteilles CO2', 200, 'TONNES', 163.045),
('TSS Ø101,6x4mm (2kg CO2)', 'Tube sans soudure pour bouteilles 2kg CO2', 200, 'TONNES', 13.597),
('TSS Ø88,9x3,2mm (1 & 1,5kg CO2)', 'Tube sans soudure pour petites bouteilles', 200, 'TONNES', 25.612),

-- Peintures poudre
('Peinture Orange à Poudre', 'Peinture époxy orange', 50, 'TONNES', 0.660),
('Peinture Bleue à Poudre', 'Peinture époxy bleue', 50, 'TONNES', 3.920),
('Peinture Noire à Poudre', 'Peinture époxy noire', 50, 'TONNES', 0.660),
('Peinture Blanche à Poudre', 'Peinture époxy blanche', 50, 'TONNES', 4.005),
('Peinture Epoxy Bleue', 'Peinture époxy bleue industrielle', 50, 'TONNES', 7.420),
('Peinture Epoxy Noire', 'Peinture époxy noire industrielle', 50, 'TONNES', 1.420),
('Peinture Epoxy Orange', 'Peinture époxy orange industrielle', 50, 'TONNES', 0.900),
('Peinture RLYFOUR Bleue', 'Peinture RLYFOUR bleue', 50, 'TONNES', 0),
('Peinture RLYFOUR Jaune', 'Peinture RLYFOUR jaune', 50, 'TONNES', 0),
('Peinture RLYFOUR Rouge', 'Peinture RLYFOUR rouge', 50, 'TONNES', 0),

-- Encres et diluants
('Encre Bleu', 'Encre bleue sérigraphie', 100, 'LITRES', 159),
('Encre Jaune UVGL 122', 'Encre jaune UV', 100, 'LITRES', 491),
('Encre Marabu UVGL122', 'Encre Marabu UV', 100, 'LITRES', 84),
('Diluant Sérigraphie UVV6', 'Diluant pour sérigraphie', 100, 'LITRES', 0),
('Diluant GLYFOUR', 'Diluant GLYFOUR', 100, 'LITRES', 0),
('Durcisseur UVHV8', 'Durcisseur UV', 100, 'LITRES', 22),
('Diluant UVV6 – Batna', 'Diluant UVV6 Batna', 100, 'LITRES', 137),
('Retardateur SV9', 'Retardateur SV9', 100, 'LITRES', 0),
('Nettoyant UR3', 'Nettoyant UR3', 100, 'LITRES', 0),
('Diluant GLV', 'Diluant GLV', 100, 'LITRES', 0),
('Diluant Retardateur', 'Diluant retardateur', 100, 'LITRES', 0),

-- Joints et accessoires
('Joints Toriques', 'Joints toriques caoutchouc', 5000, 'UNITÉS', 17700),
('Joints Auto Serreurs', 'Joints auto-serreurs', 5000, 'UNITÉS', 62400),
('Pastilles en Nylon', 'Pastilles nylon', 5000, 'UNITÉS', 59600),
('Goupilles d''Arrêt', 'Goupilles d''arrêt', 5000, 'UNITÉS', 36500),
('Limiteurs de Débit', 'Limiteurs de débit', 2000, 'UNITÉS', 51770),
('Joint Liquide', 'Joint liquide', 500, 'LITRES', 0),
('Joint Torique B03 KG', 'Joint torique B03', 10000, 'UNITÉS', 56000),
('Colle Perfect Sel', 'Colle Perfect Seal', 500, 'UNITÉS', 1297),

-- Robinetterie et valves
('Robinets B13&P35 NAFTAL', 'Robinets NAFTAL modèles B13/P35', 2000, 'UNITÉS', 4300),
('Robinet complet PG 4/6/9 Kg', 'Robinets pour bouteilles 4/6/9 kg', 2000, 'UNITÉS', 5449),
('Robinet PG50Kg', 'Robinets pour bouteilles 50 kg', 1000, 'UNITÉS', 552),
('Robinet Ammoniac', 'Robinet pour ammoniac', 500, 'UNITÉS', 0),
('Valve CO2 2-5-6 Kg', 'Valves CO2 2-5-6 kg', 1000, 'UNITÉS', 0),
('Valve CO2 1-10 Kg', 'Valves CO2 1-10 kg', 1000, 'UNITÉS', 1400),
('Multivalve PAGAZ Model GS89', 'Multivalve PAGAZ', 500, 'UNITÉS', 0),
('Clapet Porte Soupape Laiton', 'Clapet laiton', 1000, 'UNITÉS', 0),
('Clapet Laiton Filetage 3/4', 'Clapet laiton 3/4', 1000, 'UNITÉS', 0),
('Double Clapet Emplissage Laiton', 'Double clapet laiton', 500, 'UNITÉS', 0),
('Détendeur Haute Pression', 'Détendeur HP', 200, 'UNITÉS', 0),
('Manomètre 0 à 40 bars', 'Manomètre', 200, 'UNITÉS', 0),
('Adaptateur Départ Gaz TE29', 'Adaptateur TE29', 500, 'UNITÉS', 0),
('Tube Plongeur', 'Tube plongeur', 500, 'UNITÉS', 0),
('Bouchon Pour Purge', 'Bouchon purge', 1000, 'UNITÉS', 0),
('Jauge Magnétique Senior', 'Jauge magnétique', 500, 'UNITÉS', 0),
('Limiteur de Pression', 'Limiteur pression', 500, 'UNITÉS', 0),
('Soupape 1" 1/4 NPT', 'Soupape 1"1/4', 500, 'UNITÉS', 0),
('Goupille d''Arrêt Revit', 'Goupille arrêt Revit', 2000, 'UNITÉS', 0),
('Piston P/Robinet B13 KG', 'Piston robinet B13', 2000, 'UNITÉS', 50800),
('Corps Ébarber P/Robinet B13', 'Corps ébarber robinet B13', 1000, 'UNITÉS', 0),
('Volant Usine', 'Volant usine', 500, 'UNITÉS', 0),
('Vanne B03 KG', 'Vanne B03', 500, 'UNITÉS', 0),

-- Huiles et graisses
('Huile Emboutissage NAFTOCOM', 'Huile emboutissage NAFTOCOM', 1000, 'LITRES', 12240),
('Huile Emboutissage GPL 60L', 'Huile emboutissage GPL 60L', 1000, 'LITRES', 0),
('Huile Emboutissage B13/P35', 'Huile emboutissage B13/P35', 1000, 'LITRES', 0),
('Huile Emboutissage RAFTCOM', 'Huile emboutissage RAFTCOM', 1000, 'LITRES', 0),
('Huile Drawel', 'Huile Drawel', 500, 'LITRES', 0),
('Huile EV 7 ATOX', 'Huile EV7 ATOX', 500, 'LITRES', 0),

-- Flux et grenaille
('Flux de Soudure Pittarc FL182', 'Flux soudure Pittarc', 100, 'TONNES', 2.400),
('Flux de Soudage Citerne', 'Flux soudage citerne', 100, 'TONNES', 6.600),
('Grenaille d''Acier', 'Grenaille acier', 100, 'TONNES', 75.700),
('Flux de Soudage 10/71 P/Citerne', 'Flux soudage 10/71', 100, 'TONNES', 0),

-- Fûts et viroles
('Virole 1mm x 915mm', 'Virole 1x915 mm', 500, 'UNITÉS', 0),
('Fond Elliptique', 'Fond elliptique', 500, 'UNITÉS', 231),
('Fond Métalique 1mm x 1215mm', 'Fond métallique 1x1215 mm', 500, 'UNITÉS', 0),
('Fond Sup PG02 KG', 'Fond supérieur PG02', 500, 'UNITÉS', 0),
('Fond Inf FG02 KG', 'Fond inférieur FG02', 500, 'UNITÉS', 0),

-- Bouchons et bagues
('Bouchon Tri-Sure 3/4 DFT PM', 'Bouchon Tri-Sure 3/4', 2000, 'UNITÉS', 0),
('Bouchon Tri-Sure 2 DFT GM', 'Bouchon Tri-Sure 2', 2000, 'UNITÉS', 0),
('Bague Tri-Sure 3/4 DFT PM', 'Bague Tri-Sure 3/4', 2000, 'UNITÉS', 0),
('Bague Tri-Sure 2 DFT GM', 'Bague Tri-Sure 2', 2000, 'UNITÉS', 0),
('Capsule G3/4 PM', 'Capsule G3/4', 2000, 'UNITÉS', 0),
('Capsule G2 PM', 'Capsule G2', 2000, 'UNITÉS', 0),
('Bouchon Paint Caps G2 GM', 'Bouchon paint caps G2', 2000, 'UNITÉS', 0),
('Bouchon Paint Caps G3/4 PM', 'Bouchon paint caps G3/4', 2000, 'UNITÉS', 0),
('Bouchon en Plastique 3/4 PM', 'Bouchon plastique 3/4', 2000, 'UNITÉS', 0),
('Bouchon en Plastique 2 GM', 'Bouchon plastique 2', 2000, 'UNITÉS', 0),

-- Matières citernes
('Bossage Jauge Senior', 'Bossage jauge senior', 500, 'UNITÉS', 0),
('Bossage Phase Liquide 1"1/4', 'Bossage phase liquide', 500, 'UNITÉS', 0),
('Bossage Phase Gazeuse 1" 1/4', 'Bossage phase gazeuse', 500, 'UNITÉS', 0),
('Bossage Clapet Porte Soupape 2"', 'Bossage clapet 2"', 500, 'UNITÉS', 0),
('Bossage Orifice Vidange 3/4"', 'Bossage vidange 3/4', 500, 'UNITÉS', 0),
('Bossage Phase Liquide 3/4"', 'Bossage phase liquide 3/4', 500, 'UNITÉS', 0),

-- Autres consommables
('Perfect Seal LOWAC', 'Perfect Seal LOWAC', 500, 'UNITÉS', 1297),
('Poudre ABC', 'Poudre ABC extincteur', 500, 'UNITÉS', 0),
('Sacs Plastique P/R60L', 'Sacs plastique 60L', 5000, 'UNITÉS', 7422),
('Sac Plastique Torique', 'Sacs plastique toriques', 5000, 'UNITÉS', 700),
('Bouchons Réservoirs P/R60L', 'Bouchons réservoirs 60L', 2000, 'UNITÉS', 2600),
('Dégraissant', 'Dégraissant industriel', 500, 'LITRES', 2.500),
('Enduit Pour Joint', 'Enduit pour joints', 500, 'UNITÉS', 179),
('Epoxy Rouge', 'Epoxy rouge', 500, 'UNITÉS', 0.040),
('Glyfer Économique', 'Glyfer économique', 500, 'LITRES', 0.163),
('Diluant Synthétique', 'Diluant synthétique', 500, 'LITRES', 0.200),
('Catalyseur', 'Catalyseur', 500, 'LITRES', 0),
('MARKYD', 'Produit MARKYD', 500, 'UNITÉS', 0);


-- ============================================================
-- 4. ASSOCIATION MATIÈRES ↔ CATÉGORIES
-- ============================================================

-- Tôles et Bobines
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Tôles et Bobines'
AND mp.nom_pr LIKE 'Tole%'
ON CONFLICT DO NOTHING;

-- Feuillards
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Feuillards'
AND mp.nom_pr LIKE 'Feuillard%'
ON CONFLICT DO NOTHING;

-- Collerettes
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Collerettes'
AND mp.nom_pr LIKE 'Collerettes%'
ON CONFLICT DO NOTHING;

-- Fil à souder
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Fil à souder'
AND (mp.nom_pr LIKE 'Fil à Souder%' OR mp.nom_pr LIKE 'Fil Electrodes%')
ON CONFLICT DO NOTHING;

-- Fil de zinc
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Fil de zinc'
AND mp.nom_pr LIKE 'Fil de Zinc%'
ON CONFLICT DO NOTHING;

-- Laiton
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Laiton'
AND mp.nom_pr LIKE 'Barre Laiton%'
ON CONFLICT DO NOTHING;

-- Tubes sans soudure
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Tubes sans soudure'
AND mp.nom_pr LIKE 'TSS%'
ON CONFLICT DO NOTHING;

-- Peintures poudre
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Peintures poudre'
AND (mp.nom_pr LIKE 'Peinture%' OR mp.nom_pr LIKE 'Peinture%Poudre%' OR mp.nom_pr LIKE 'Peinture Epoxy%')
ON CONFLICT DO NOTHING;

-- Encres et diluants
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Encres et diluants'
AND (mp.nom_pr LIKE 'Encre%' OR mp.nom_pr LIKE 'Diluant%' OR mp.nom_pr LIKE 'Durcisseur%' OR mp.nom_pr LIKE 'Retardateur%' OR mp.nom_pr LIKE 'Nettoyant%')
ON CONFLICT DO NOTHING;

-- Joints et accessoires
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Joints et accessoires'
AND (mp.nom_pr LIKE 'Joint%' OR mp.nom_pr LIKE 'Pastilles%' OR mp.nom_pr LIKE 'Goupilles%' OR mp.nom_pr LIKE 'Limiteurs%' OR mp.nom_pr LIKE 'Colle%')
ON CONFLICT DO NOTHING;

-- Robinetterie et valves
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Robinetterie et valves'
AND (mp.nom_pr LIKE 'Robinets%' OR mp.nom_pr LIKE 'Robinet%' OR mp.nom_pr LIKE 'Valve%' OR mp.nom_pr LIKE 'Multivalve%' OR mp.nom_pr LIKE 'Clapet%' OR mp.nom_pr LIKE 'Détendeur%' OR mp.nom_pr LIKE 'Manomètre%' OR mp.nom_pr LIKE 'Adaptateur%' OR mp.nom_pr LIKE 'Soupape%' OR mp.nom_pr LIKE 'Vanne%')
ON CONFLICT DO NOTHING;

-- Huiles et graisses
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Huiles et graisses'
AND mp.nom_pr LIKE 'Huile%'
ON CONFLICT DO NOTHING;

-- Flux et grenaille
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Flux et grenaille'
AND (mp.nom_pr LIKE 'Flux%' OR mp.nom_pr LIKE 'Grenaille%')
ON CONFLICT DO NOTHING;

-- Fûts et viroles
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Fûts et viroles'
AND (mp.nom_pr LIKE 'Virole%' OR mp.nom_pr LIKE 'Fond%')
ON CONFLICT DO NOTHING;

-- Bouchons et bagues
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Bouchons et bagues'
AND (mp.nom_pr LIKE 'Bouchon%' OR mp.nom_pr LIKE 'Bague%' OR mp.nom_pr LIKE 'Capsule%')
ON CONFLICT DO NOTHING;

-- Matières citernes
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Matières citernes'
AND mp.nom_pr LIKE 'Bossage%'
ON CONFLICT DO NOTHING;

-- Autres consommables
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp, categorie c
WHERE c.nom_categorie = 'Autres consommables'
AND mp.nom_pr IN ('Perfect Seal LOWAC', 'Poudre ABC', 'Sacs Plastique P/R60L', 'Sac Plastique Torique', 
                  'Bouchons Réservoirs P/R60L', 'Dégraissant', 'Enduit Pour Joint', 'Epoxy Rouge', 
                  'Glyfer Économique', 'Diluant Synthétique', 'Catalyseur', 'MARKYD')
ON CONFLICT DO NOTHING;


SELECT * FROM mouvement;
-- ============================================================
-- 5. VÉRIFICATION
-- ============================================================
SELECT COUNT(*) AS total_matieres FROM matiere_premiere;
SELECT c.nom_categorie, COUNT(mc.matiere_id) AS nb_matieres
FROM categorie c
LEFT JOIN matiere_categorie mc ON c.id_categorie = mc.categorie_id
GROUP BY c.nom_categorie
ORDER BY c.nom_categorie;

-- Vérifier que la colonne quantite a été ajoutée
SELECT id_pr, nom_pr, quantite, unite_mesure FROM matiere_premiere LIMIT 10;
>>>>>>> cdb999b (listeproduit)
