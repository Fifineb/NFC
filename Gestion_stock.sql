
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

-- Table Stock (corrigée avec les bonnes références)
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

-- Insertion des magasins
INSERT INTO magasin (nom_magasin, adresse, region_id) VALUES
('Magasin Production', 'Alger Centre', 1),
('Magasin Matiere Premiere', 'Alger Est', 2);

-- Insertion des matières premières
INSERT INTO matiere_premiere (nom_pr, description, seuil_minimal, unite_mesure) VALUES
('Tole', 'BS2 1070*2,58 Importation', 4000, 'TO'),
('Fil Zinc', 'Fil de zinc de qualité industrielle', 500, 'TO');

-- Insertion de l'utilisateur
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Oussama', 'Admin', 'oussama@gmail.com', 'oussama123456', 'ADMINISTRATEUR');

-- Insertion des stocks (corrigé - sans id_st)
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
