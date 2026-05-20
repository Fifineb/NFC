-- =============================================================
-- SECTION 1 : TYPES ENUM
-- =============================================================

CREATE TYPE statut_matiere AS ENUM ('DISPONIBLE', 'RUPTURE', 'PERIME');
CREATE TYPE statut_alerte AS ENUM ('ACTIVE', 'TRAITEE');
CREATE TYPE statut_commande AS ENUM ('EN_ATTENTE', 'VALIDEE', 'LIVREE', 'ANNULEE');
CREATE TYPE role_utilisateur AS ENUM ('ADMINISTRATEUR', 'GESTIONNAIRE', 'SUPERVISEUR', 'MAGASINIER');
CREATE TYPE type_mouvement_enum AS ENUM ('ENTREE', 'SORTIE', 'CONSOMMATION', 'ACHAT', 'AJUSTEMENT');
CREATE TYPE type_rapport_enum AS ENUM ('STOCK', 'COMMANDE', 'MOUVEMENT', 'ALERTE', 'GLOBAL');
CREATE TYPE degre_urgence_enum AS ENUM ('NORMAL', 'URGENT', 'TRES_URGENT');

-- =============================================================
-- SECTION 2 : TABLES (ordre respectant les dépendances FK)
-- =============================================================

CREATE TABLE region (
    region_id SERIAL PRIMARY KEY,
    nom_r VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    adresse_r VARCHAR(255)
);

CREATE TABLE magasin (
    id SERIAL PRIMARY KEY,
    nom_magasin VARCHAR(255) NOT NULL,
    adresse TEXT,
    region_id INTEGER REFERENCES region(region_id) ON DELETE SET NULL
);

CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role role_utilisateur NOT NULL,
    actif BOOLEAN DEFAULT true,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dernier_login TIMESTAMP
);

CREATE TABLE fournisseur (
    id_f SERIAL PRIMARY KEY,
    raison_sociale VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adresse TEXT,
    telephone VARCHAR(50),
    actif BOOLEAN DEFAULT true
);

CREATE TABLE categorie (
    id_categorie SERIAL PRIMARY KEY,
    nom_categorie VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE matiere_premiere (
    id_pr SERIAL PRIMARY KEY,
    nom_pr VARCHAR(255) NOT NULL,
    description TEXT,
    seuil_minimal DOUBLE PRECISION NOT NULL CHECK (seuil_minimal >= 0),
    unite_mesure VARCHAR(50),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut statut_matiere DEFAULT 'DISPONIBLE',
    quantite DOUBLE PRECISION DEFAULT 0 CHECK (quantite >= 0),
    actif BOOLEAN DEFAULT true
);

CREATE TABLE matiere_categorie (
    matiere_id INTEGER REFERENCES matiere_premiere(id_pr) ON DELETE CASCADE,
    categorie_id INTEGER REFERENCES categorie(id_categorie) ON DELETE CASCADE,
    PRIMARY KEY (matiere_id, categorie_id)
);

CREATE TABLE alerte (
    id_alerte SERIAL PRIMARY KEY,
    date_alerte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message TEXT NOT NULL,
    statut statut_alerte DEFAULT 'ACTIVE',
    matiere_id INTEGER REFERENCES matiere_premiere(id_pr) ON DELETE CASCADE
);

CREATE TABLE stock (
    id_st SERIAL PRIMARY KEY,
    quantite_actuelle DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (quantite_actuelle >= 0),
    gisement VARCHAR(255),
    date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    magasin_id INTEGER REFERENCES magasin(id) ON DELETE CASCADE,
    matiere_id INTEGER REFERENCES matiere_premiere(id_pr) ON DELETE CASCADE,
    UNIQUE(magasin_id, matiere_id)
);

CREATE TABLE commande (
    id_cm SERIAL PRIMARY KEY,
    numero_commande VARCHAR(50) UNIQUE,
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_livraison_prevue DATE,
    date_livraison_reelle DATE,
    quantite_commandee DOUBLE PRECISION NOT NULL CHECK (quantite_commandee > 0),
    quantite_recue DOUBLE PRECISION DEFAULT 0 CHECK (quantite_recue >= 0),
    statut statut_commande DEFAULT 'EN_ATTENTE',
    fournisseur_id INTEGER REFERENCES fournisseur(id_f) ON DELETE RESTRICT,
    matiere_id INTEGER REFERENCES matiere_premiere(id_pr) ON DELETE RESTRICT,
    utilisateur_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL
);

CREATE TABLE rapport (
    id SERIAL PRIMARY KEY,
    type_rapport type_rapport_enum NOT NULL,
    date_debut DATE,
    date_fin DATE,
    montant_total_ht DOUBLE PRECISION,
    montant_net DOUBLE PRECISION,
    taux_tva DOUBLE PRECISION DEFAULT 19,
    magasin_id INTEGER REFERENCES magasin(id) ON DELETE SET NULL,
    utilisateur_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_generation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table parent MOUVEMENT (héritage JOINED)
CREATE TABLE mouvement (
    id_mouvement SERIAL PRIMARY KEY,
    date_mouvement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantite DOUBLE PRECISION NOT NULL CHECK (quantite > 0),
    reference_bon VARCHAR(100),
    observation TEXT,
    type_mouvement type_mouvement_enum NOT NULL,
    stock_id INTEGER REFERENCES stock(id_st) ON DELETE SET NULL,
    utilisateur_id INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- Tables enfants (héritage JOINED)
CREATE TABLE bon_consommation (
    id_mouvement INTEGER PRIMARY KEY REFERENCES mouvement(id_mouvement) ON DELETE CASCADE,
    departement VARCHAR(100),
    motif_consommation TEXT
);

CREATE TABLE bon_sortie (
    id_mouvement INTEGER PRIMARY KEY REFERENCES mouvement(id_mouvement) ON DELETE CASCADE,
    departement VARCHAR(100),
    code_machine VARCHAR(100),
    compte_analytique VARCHAR(100),
    destinataire VARCHAR(100)
);

CREATE TABLE bon_entree (
    id_mouvement INTEGER PRIMARY KEY REFERENCES mouvement(id_mouvement) ON DELETE CASCADE,
    fournisseur_id INTEGER REFERENCES fournisseur(id_f) ON DELETE SET NULL,
    num_facture VARCHAR(100),
    numero_bl VARCHAR(100),
    quantite_conforme DOUBLE PRECISION CHECK (quantite_conforme >= 0),
    quantite_refusee DOUBLE PRECISION DEFAULT 0 CHECK (quantite_refusee >= 0),
    prix_unitaire_achat DOUBLE PRECISION CHECK (prix_unitaire_achat >= 0),
    CONSTRAINT chk_qte_conforme_refusee CHECK (quantite_conforme + quantite_refusee >= 0)
);

CREATE TABLE commande_achat (
    id_mouvement INTEGER PRIMARY KEY REFERENCES mouvement(id_mouvement) ON DELETE CASCADE,
    date_livraison_prevue DATE,
    degre_urgence degre_urgence_enum DEFAULT 'NORMAL',
    prix_total_estime DOUBLE PRECISION CHECK (prix_total_estime >= 0),
    fournisseur_id INTEGER REFERENCES fournisseur(id_f) ON DELETE SET NULL
);

-- =============================================================
-- SECTION 3 : INDEX
-- =============================================================

CREATE INDEX idx_matiere_statut ON matiere_premiere(statut);
CREATE INDEX idx_commande_statut ON commande(statut);
CREATE INDEX idx_stock_matiere ON stock(matiere_id);
CREATE INDEX idx_mouvement_date ON mouvement(date_mouvement);
CREATE INDEX idx_alerte_matiere ON alerte(matiere_id);
CREATE INDEX idx_commande_fournisseur ON commande(fournisseur_id);
CREATE INDEX idx_stock_magasin ON stock(magasin_id);
CREATE INDEX idx_mouvement_type ON mouvement(type_mouvement);
CREATE INDEX idx_bon_sortie_mouvement ON bon_sortie(id_mouvement);
CREATE INDEX idx_commande_achat_fourn ON commande_achat(fournisseur_id);
CREATE INDEX idx_alerte_statut ON alerte(statut);
CREATE INDEX idx_mouvement_stock ON mouvement(stock_id);
CREATE INDEX idx_mouvement_utilisateur ON mouvement(utilisateur_id);
CREATE INDEX idx_commande_utilisateur ON commande(utilisateur_id);
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);
CREATE INDEX idx_bon_entree_fournisseur ON bon_entree(fournisseur_id);

-- =============================================================
-- SECTION 4 : FONCTIONS & TRIGGERS
-- =============================================================

-- 4.1 Mise à jour automatique date_modification
CREATE OR REPLACE FUNCTION fn_update_date_modif()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_matiere
    BEFORE UPDATE ON matiere_premiere
    FOR EACH ROW EXECUTE FUNCTION fn_update_date_modif();

CREATE TRIGGER trg_update_fournisseur
    BEFORE UPDATE ON fournisseur
    FOR EACH ROW EXECUTE FUNCTION fn_update_date_modif();

CREATE TRIGGER trg_update_utilisateurs
    BEFORE UPDATE ON utilisateurs
    FOR EACH ROW EXECUTE FUNCTION fn_update_date_modif();

-- 4.2 Mise à jour du stock après mouvement
CREATE OR REPLACE FUNCTION fn_update_stock_after_mouvement()
RETURNS TRIGGER AS $$
DECLARE
    v_matiere_id INTEGER;
    v_delta DOUBLE PRECISION;
    v_qte_actuelle DOUBLE PRECISION;
    v_nom_matiere VARCHAR(255);
BEGIN
    -- Vérification du stock_id
    IF NEW.stock_id IS NULL THEN
        RAISE EXCEPTION 'MOUVEMENT [id=%] : stock_id ne peut pas être NULL', NEW.id_mouvement;
    END IF;

    -- Calcul du delta selon le type de mouvement
    IF NEW.type_mouvement IN ('ENTREE', 'ACHAT') THEN
        v_delta := NEW.quantite;
    ELSIF NEW.type_mouvement IN ('SORTIE', 'CONSOMMATION') THEN
        v_delta := -NEW.quantite;
    ELSIF NEW.type_mouvement = 'AJUSTEMENT' THEN
        v_delta := NEW.quantite;
    ELSE
        RAISE EXCEPTION 'Type de mouvement invalide: %', NEW.type_mouvement;
    END IF;

    -- Récupération des informations avec verrou
    SELECT s.quantite_actuelle, s.matiere_id, m.nom_pr
    INTO v_qte_actuelle, v_matiere_id, v_nom_matiere
    FROM stock s
    JOIN matiere_premiere m ON s.matiere_id = m.id_pr
    WHERE s.id_st = NEW.stock_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Stock non trouvé pour ID: %', NEW.stock_id;
    END IF;

    -- Vérification stock suffisant
    IF (v_qte_actuelle + v_delta) < 0 THEN
        RAISE EXCEPTION 'STOCK INSUFFISANT - Matière: %, Stock actuel: %, Sortie demandée: %',
                        v_nom_matiere, v_qte_actuelle, NEW.quantite;
    END IF;

    -- Mise à jour du stock
    UPDATE stock
    SET quantite_actuelle = quantite_actuelle + v_delta,
        date_mise_a_jour = CURRENT_TIMESTAMP
    WHERE id_st = NEW.stock_id;

    -- Synchronisation de la quantité dénormalisée
    UPDATE matiere_premiere
    SET quantite = (SELECT COALESCE(SUM(quantite_actuelle), 0) FROM stock WHERE matiere_id = v_matiere_id)
    WHERE id_pr = v_matiere_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stock_update
    AFTER INSERT ON mouvement
    FOR EACH ROW EXECUTE FUNCTION fn_update_stock_after_mouvement();

-- 4.3 Empêcher stock négatif (sécurité complémentaire)
CREATE OR REPLACE FUNCTION fn_prevent_negative_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantite_actuelle < 0 THEN
        RAISE EXCEPTION 'STOCK NEGATIF INTERDIT - stock_id=%, valeur tentée=%',
                        NEW.id_st, NEW.quantite_actuelle;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_negative_stock
    BEFORE UPDATE ON stock
    FOR EACH ROW EXECUTE FUNCTION fn_prevent_negative_stock();

-- 4.4 Gestion automatique des alertes
CREATE OR REPLACE FUNCTION fn_manage_stock_alert()
RETURNS TRIGGER AS $$
DECLARE
    v_seuil DOUBLE PRECISION;
    v_nom VARCHAR(255);
    v_unite VARCHAR(50);
BEGIN
    SELECT seuil_minimal, nom_pr, unite_mesure
    INTO v_seuil, v_nom, v_unite
    FROM matiere_premiere
    WHERE id_pr = NEW.matiere_id;

    -- Mise à jour du statut matière
    IF NEW.quantite_actuelle = 0 THEN
        UPDATE matiere_premiere SET statut = 'RUPTURE' WHERE id_pr = NEW.matiere_id;
    ELSIF NEW.quantite_actuelle < v_seuil THEN
        UPDATE matiere_premiere SET statut = 'DISPONIBLE' WHERE id_pr = NEW.matiere_id;
    ELSE
        UPDATE matiere_premiere SET statut = 'DISPONIBLE' WHERE id_pr = NEW.matiere_id;
    END IF;

    -- Création d'alerte si stock < seuil
    IF NEW.quantite_actuelle < v_seuil THEN
        IF NOT EXISTS (SELECT 1 FROM alerte WHERE matiere_id = NEW.matiere_id AND statut = 'ACTIVE') THEN
            INSERT INTO alerte (message, matiere_id)
            VALUES (format('ALERTE: %s - Stock (%s %s) inférieur au seuil (%s %s)',
                    v_nom, NEW.quantite_actuelle, COALESCE(v_unite,''),
                    v_seuil, COALESCE(v_unite,'')), NEW.matiere_id);
        END IF;
    ELSE
        -- Fermeture des alertes si stock remonté
        UPDATE alerte SET statut = 'TRAITEE'
        WHERE matiere_id = NEW.matiere_id AND statut = 'ACTIVE';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_manage_alert
    AFTER UPDATE ON stock
    FOR EACH ROW EXECUTE FUNCTION fn_manage_stock_alert();

-- 4.5 Validation bon entrée
CREATE OR REPLACE FUNCTION fn_check_bon_entree()
RETURNS TRIGGER AS $$
DECLARE
    v_qte_mouvement DOUBLE PRECISION;
BEGIN
    SELECT quantite INTO v_qte_mouvement
    FROM mouvement WHERE id_mouvement = NEW.id_mouvement;

    IF (COALESCE(NEW.quantite_conforme, 0) + COALESCE(NEW.quantite_refusee, 0)) > v_qte_mouvement THEN
        RAISE EXCEPTION 'Quantité totale (conforme + refusée) dépasse la quantité du mouvement';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_bon_entree
    BEFORE INSERT OR UPDATE ON bon_entree
    FOR EACH ROW EXECUTE FUNCTION fn_check_bon_entree();

-- 4.6 Génération numéro commande
CREATE OR REPLACE FUNCTION fn_generate_commande_number()
RETURNS TRIGGER AS $$
DECLARE
    annee VARCHAR(4);
    mois VARCHAR(2);
    sequence INTEGER;
BEGIN
    annee := to_char(CURRENT_DATE, 'YYYY');
    mois := to_char(CURRENT_DATE, 'MM');
    
    SELECT COALESCE(MAX(CAST(substring(numero_commande FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO sequence
    FROM commande
    WHERE numero_commande LIKE 'CMD-' || annee || mois || '-%';
    
    NEW.numero_commande := 'CMD-' || annee || mois || '-' || LPAD(sequence::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_commande_number
    BEFORE INSERT ON commande
    FOR EACH ROW
    WHEN (NEW.numero_commande IS NULL)
    EXECUTE FUNCTION fn_generate_commande_number();

-- 4.7 Protection suppression fournisseur avec commandes actives
CREATE OR REPLACE FUNCTION fn_prevent_delete_fournisseur()
RETURNS TRIGGER AS $$
DECLARE
    v_nb INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_nb
    FROM commande
    WHERE fournisseur_id = OLD.id_f AND statut NOT IN ('LIVREE', 'ANNULEE');
    
    IF v_nb > 0 THEN
        RAISE EXCEPTION 'Impossible de supprimer le fournisseur % - % commande(s) en cours',
                        OLD.raison_sociale, v_nb;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_delete_fournisseur
    BEFORE DELETE ON fournisseur
    FOR EACH ROW EXECUTE FUNCTION fn_prevent_delete_fournisseur();

-- 4.8 Validation transition statut commande
CREATE OR REPLACE FUNCTION fn_check_commande_transition()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.statut IN ('LIVREE', 'ANNULEE') AND NEW.statut <> OLD.statut THEN
        RAISE EXCEPTION 'Commande % : transition interdite de % vers % (statut final)',
                        OLD.id_cm, OLD.statut, NEW.statut;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_commande_transition
    BEFORE UPDATE ON commande
    FOR EACH ROW EXECUTE FUNCTION fn_check_commande_transition();

-- =============================================================
-- SECTION 5 : VUES
-- =============================================================

-- Vue stock global
CREATE VIEW v_stock_global AS
SELECT 
    m.id_pr,
    m.nom_pr,
    m.unite_mesure,
    m.seuil_minimal,
    m.statut,
    COALESCE(SUM(s.quantite_actuelle), 0) AS quantite_totale,
    CASE 
        WHEN COALESCE(SUM(s.quantite_actuelle), 0) = 0 THEN 'RUPTURE'
        WHEN COALESCE(SUM(s.quantite_actuelle), 0) < m.seuil_minimal THEN 'CRITIQUE'
        WHEN COALESCE(SUM(s.quantite_actuelle), 0) < m.seuil_minimal * 1.5 THEN 'FAIBLE'
        ELSE 'NORMAL'
    END AS niveau_stock
FROM matiere_premiere m
LEFT JOIN stock s ON m.id_pr = s.matiere_id
WHERE m.actif = true
GROUP BY m.id_pr, m.nom_pr, m.unite_mesure, m.seuil_minimal, m.statut;

-- Vue alertes actives
CREATE VIEW v_alertes_actives AS
SELECT 
    a.id_alerte,
    a.message,
    a.date_alerte,
    m.nom_pr,
    m.unite_mesure,
    m.seuil_minimal,
    COALESCE(SUM(s.quantite_actuelle), 0) AS quantite_actuelle
FROM alerte a
JOIN matiere_premiere m ON a.matiere_id = m.id_pr
LEFT JOIN stock s ON s.matiere_id = m.id_pr
WHERE a.statut = 'ACTIVE'
GROUP BY a.id_alerte, a.message, a.date_alerte, m.nom_pr, m.unite_mesure, m.seuil_minimal;

-- Vue commandes détaillées
CREATE VIEW v_commandes_details AS
SELECT 
    c.id_cm,
    c.numero_commande,
    c.date_commande,
    c.date_livraison_prevue,
    c.date_livraison_reelle,
    c.quantite_commandee,
    c.quantite_recue,
    (c.quantite_commandee - c.quantite_recue) AS quantite_restante,
    c.statut,
    f.raison_sociale,
    f.telephone AS fournisseur_telephone,
    m.nom_pr,
    m.unite_mesure,
    u.nom || ' ' || u.prenom AS cree_par,
    CASE 
        WHEN c.date_livraison_prevue < CURRENT_DATE AND c.statut NOT IN ('LIVREE', 'ANNULEE') THEN 'EN_RETARD'
        WHEN c.statut = 'LIVREE' THEN 'LIVREE'
        WHEN c.statut = 'ANNULEE' THEN 'ANNULEE'
        ELSE 'EN_COURS'
    END AS etat_livraison
FROM commande c
JOIN fournisseur f ON c.fournisseur_id = f.id_f
JOIN matiere_premiere m ON c.matiere_id = m.id_pr
LEFT JOIN utilisateurs u ON c.utilisateur_id = u.id;

-- Vue mouvements détaillés
CREATE VIEW v_mouvements_details AS
SELECT 
    mv.id_mouvement,
    mv.date_mouvement,
    mv.type_mouvement,
    mv.quantite,
    mv.reference_bon,
    mv.observation,
    m.nom_pr,
    m.unite_mesure,
    mag.nom_magasin,
    u.nom || ' ' || u.prenom AS operateur
FROM mouvement mv
JOIN stock s ON mv.stock_id = s.id_st
JOIN matiere_premiere m ON s.matiere_id = m.id_pr
JOIN magasin mag ON s.magasin_id = mag.id
LEFT JOIN utilisateurs u ON mv.utilisateur_id = u.id;

-- Vue stock par magasin
CREATE VIEW v_stock_par_magasin AS
SELECT
    mag.nom_magasin,
    r.nom_r AS region,
    m.nom_pr,
    m.unite_mesure,
    s.quantite_actuelle,
    s.gisement,
    s.date_mise_a_jour,
    CASE WHEN s.quantite_actuelle < m.seuil_minimal THEN 'ALERTE' ELSE 'OK' END AS statut_alerte
FROM stock s
JOIN magasin mag ON s.magasin_id = mag.id
JOIN region r ON mag.region_id = r.region_id
JOIN matiere_premiere m ON s.matiere_id = m.id_pr
ORDER BY mag.nom_magasin, m.nom_pr;

-- Vue utilisateurs actifs
CREATE VIEW v_utilisateurs_actifs AS
SELECT id, nom, prenom, email, role, date_creation, dernier_login
FROM utilisateurs
WHERE actif = true;

-- Vue commandes achat
CREATE VIEW v_commandes_achat AS
SELECT
    mv.id_mouvement,
    mv.date_mouvement,
    mv.quantite,
    mv.reference_bon,
    ca.date_livraison_prevue,
    ca.degre_urgence,
    ca.prix_total_estime,
    f.raison_sociale AS fournisseur,
    m.nom_pr AS matiere,
    u.nom || ' ' || u.prenom AS operateur
FROM commande_achat ca
JOIN mouvement mv ON ca.id_mouvement = mv.id_mouvement
JOIN stock s ON mv.stock_id = s.id_st
JOIN matiere_premiere m ON s.matiere_id = m.id_pr
LEFT JOIN fournisseur f ON ca.fournisseur_id = f.id_f
LEFT JOIN utilisateurs u ON mv.utilisateur_id = u.id;

-- Vue dashboard
CREATE VIEW v_dashboard AS
SELECT
    (SELECT COUNT(*) FROM utilisateurs WHERE actif = true) AS utilisateurs_actifs,
    (SELECT COUNT(*) FROM fournisseur WHERE actif = true) AS fournisseurs_actifs,
    (SELECT COUNT(*) FROM commande WHERE statut = 'EN_ATTENTE') AS commandes_en_attente,
    (SELECT COUNT(*) FROM commande WHERE statut = 'VALIDEE') AS commandes_validees,
    (SELECT COUNT(*) FROM alerte WHERE statut = 'ACTIVE') AS alertes_actives,
    (SELECT COUNT(*) FROM matiere_premiere WHERE statut = 'RUPTURE') AS matieres_en_rupture,
    (SELECT COUNT(*) FROM matiere_premiere WHERE statut = 'PERIME') AS matieres_perimees,
    (SELECT COALESCE(SUM(quantite_actuelle), 0) FROM stock) AS stock_total_unites,
    (SELECT COUNT(*) FROM mouvement WHERE date_mouvement >= CURRENT_DATE) AS mouvements_aujourdhui,
    (SELECT COUNT(*) FROM mouvement WHERE date_mouvement >= CURRENT_DATE - INTERVAL '30 days') AS mouvements_30_jours;

-- =============================================================
-- SECTION 6 : DONNÉES DE TEST
-- =============================================================

-- Régions
INSERT INTO region (nom_r, description, adresse_r) VALUES
('Unité Centrale', 'Siège principal', 'Alger'),
('Unité Batna', 'Est', 'Batna'),
('Unité Mascara', 'Ouest', 'Mascara'),
('Unité Alger', 'Centre', 'Alger');

-- Magasins
INSERT INTO magasin (nom_magasin, adresse, region_id) VALUES
('Magasin Production', 'Alger Centre', 1),
('Magasin Matiere Premiere', 'Alger Est', 2),
('Magasin Stock Sécurité', 'Alger Ouest', 4);

-- Utilisateurs
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES
('Oussama', 'Admin', 'oussama@gmail.com', '$2b$12$HASH_A_REMPLACER', 'ADMINISTRATEUR'),
('Zakaria', 'Ayoud', 'zaki@gmail.com', '$2b$12$HASH_A_REMPLACER', 'MAGASINIER'),
('Feriel', 'Nebbache', 'feriel471@gmail.com', '$2b$12$HASH_A_REMPLACER', 'SUPERVISEUR'),
('Yasmine', 'Maroua', 'maroua12@gmail.com', '$2b$12$HASH_A_REMPLACER', 'GESTIONNAIRE');

-- Fournisseurs
INSERT INTO fournisseur (raison_sociale, email, adresse, telephone, actif) VALUES
('Acier Import SARL', 'contact@acier-import.dz', 'Rouiba', '021556677', true),
('Matières Premières SAS', 'contact@mp-sas.dz', 'Alger Centre', '023456789', true);

-- Catégories
INSERT INTO categorie (nom_categorie, description) VALUES
('Métaux', 'Matières premières métalliques'),
('Polymères', 'Matières plastiques'),
('Produits chimiques', 'Produits chimiques industriels');

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


-- Vérifier si l'utilisateur existe
UPDATE utilisateurs 
SET mot_de_passe = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    actif = true
WHERE email = 'oussama@gmail.com';




UPDATE utilisateurs 
SET mot_de_passe = '$2a$12$IQyD3LorxfBYMl0TosFgvO7fkIlv3PYhDEvjacba2hqgSt2bH8MP.',
    actif = true
WHERE email = 'feriel471@gmail.com';


-- ============================================================
--  SECTIONS 7 ET 8 CORRIGÉES
--  Basées sur les classes Java :
--    - MatierePremiere  (colonne : nom_pr)
--    - Categorie        (colonne : nom_categorie, id_categorie)
--    - Magasin          (colonne : id, nom_magasin)
--    - Stock            (UNIQUE sur magasin_id + matiere_id)
-- ============================================================


-- ============================================================
-- SECTION 7 : Liaison matières ↔ catégories
-- Correction : on utilise = au lieu de LIKE
--              et les noms exacts tels qu'insérés en section 6
-- ============================================================

-- Tôles et Bobines
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Tôles et Bobines'
AND mp.nom_pr IN (
    'Tole BS2 1070x2,58 Import',
    'Tole BS2 1070x2,58 SIDER',
    'Tole BS2 910x3,30 Flan P35 IMP',
    'Tole BS2 1100x3,30 Virole P35 IMP',
    'Tole BS2 990x3,00 Import',
    'Tole BS2 990x3,00 SIDER',
    'Tole BS2 870x3,00 Import',
    'Tole BS2 880x2,58 B6 Kg',
    'Tole Acier 4000x3200x9mm'
)
ON CONFLICT DO NOTHING;

-- Feuillards
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Feuillards'
AND mp.nom_pr IN (
    'Feuillard Pied 85x3mm',
    'Feuillard Collier 145x2,5mm',
    'Feuillard Collier 145x2,58mm',
    'Feuillard Pied 70x2,5mm',
    'Feuillard Pied 70x3mm',
    'Feuillard Pied 85x3 neuves',
    'Feuillard Collier 130x2mm B6'
)
ON CONFLICT DO NOTHING;

-- Collerettes
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Collerettes'
AND mp.nom_pr IN (
    'Collerettes B13 & P35',
    'Collerettes SIRGHAZ'
)
ON CONFLICT DO NOTHING;

-- Fil à souder
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Fil à souder'
AND mp.nom_pr IN (
    'Fil à Souder Ø1 mm',
    'Fil à Souder Ø1,2 mm',
    'Fil à Souder Ø1,6 mm',
    'Fil à Souder Ø2,4 mm',
    'Fil Electrodes Diam 1mm',
    'Fil Electrodes Diam 2,4mm',
    'Fil à Souder Citerne 3,2mm'
)
ON CONFLICT DO NOTHING;

-- Fil de zinc
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Fil de zinc'
AND mp.nom_pr IN (
    'Fil de Zinc Ø4,76 mm',
    'Fil de Zinc Ø3,17 mm'
)
ON CONFLICT DO NOTHING;

-- Laiton
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Laiton'
AND mp.nom_pr IN (
    'Barre Laiton Ø14 mm',
    'Barre Laiton Ø16 mm',
    'Barre Laiton Ø25 mm'
)
ON CONFLICT DO NOTHING;

-- Tubes sans soudure
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Tubes sans soudure'
AND mp.nom_pr IN (
    'TSS Ø139,7x5mm (5-6 & 10kg CO2)',
    'TSS Ø101,6x4mm (2kg CO2)',
    'TSS Ø88,9x3,2mm (1 & 1,5kg CO2)'
)
ON CONFLICT DO NOTHING;

-- Peintures poudre
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Peintures poudre'
AND mp.nom_pr IN (
    'Peinture Orange à Poudre',
    'Peinture Bleue à Poudre',
    'Peinture Noire à Poudre',
    'Peinture Blanche à Poudre',
    'Peinture Epoxy Bleue',
    'Peinture Epoxy Noire',
    'Peinture Epoxy Orange',
    'Peinture RLYFOUR Bleue',
    'Peinture RLYFOUR Jaune',
    'Peinture RLYFOUR Rouge'
)
ON CONFLICT DO NOTHING;

-- Encres et diluants
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Encres et diluants'
AND mp.nom_pr IN (
    'Encre Bleu',
    'Encre Jaune UVGL 122',
    'Encre Marabu UVGL122',
    'Diluant Sérigraphie UVV6',
    'Diluant GLYFOUR',
    'Durcisseur UVHV8',
    'Diluant UVV6 – Batna',
    'Retardateur SV9',
    'Nettoyant UR3',
    'Diluant GLV',
    'Diluant Retardateur'
)
ON CONFLICT DO NOTHING;

-- Joints et accessoires
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Joints et accessoires'
AND mp.nom_pr IN (
    'Joints Toriques',
    'Joints Auto Serreurs',
    'Pastilles en Nylon',
    'Goupilles d''Arrêt',
    'Limiteurs de Débit',
    'Joint Liquide',
    'Joint Torique B03 KG',
    'Colle Perfect Sel'
)
ON CONFLICT DO NOTHING;

-- Robinetterie et valves
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Robinetterie et valves'
AND mp.nom_pr IN (
    'Robinets B13&P35 NAFTAL',
    'Robinet complet PG 4/6/9 Kg',
    'Robinet PG50Kg',
    'Robinet Ammoniac',
    'Valve CO2 2-5-6 Kg',
    'Valve CO2 1-10 Kg',
    'Multivalve PAGAZ Model GS89',
    'Clapet Porte Soupape Laiton',
    'Clapet Laiton Filetage 3/4',
    'Double Clapet Emplissage Laiton',
    'Détendeur Haute Pression',
    'Manomètre 0 à 40 bars',
    'Adaptateur Départ Gaz TE29',
    'Tube Plongeur',
    'Bouchon Pour Purge',
    'Jauge Magnétique Senior',
    'Limiteur de Pression',
    'Soupape 1" 1/4 NPT',
    'Goupille d''Arrêt Revit',
    'Piston P/Robinet B13 KG',
    'Corps Ébarber P/Robinet B13',
    'Volant Usine',
    'Vanne B03 KG'
)
ON CONFLICT DO NOTHING;

-- Huiles et graisses
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Huiles et graisses'
AND mp.nom_pr IN (
    'Huile Emboutissage NAFTOCOM',
    'Huile Emboutissage GPL 60L',
    'Huile Emboutissage B13/P35',
    'Huile Emboutissage RAFTCOM',
    'Huile Drawel',
    'Huile EV 7 ATOX'
)
ON CONFLICT DO NOTHING;

-- Flux et grenaille
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Flux et grenaille'
AND mp.nom_pr IN (
    'Flux de Soudure Pittarc FL182',
    'Flux de Soudage Citerne',
    'Grenaille d''Acier',
    'Flux de Soudage 10/71 P/Citerne'
)
ON CONFLICT DO NOTHING;

-- Fûts et viroles
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Fûts et viroles'
AND mp.nom_pr IN (
    'Virole 1mm x 915mm',
    'Fond Elliptique',
    'Fond Métalique 1mm x 1215mm',
    'Fond Sup PG02 KG',
    'Fond Inf FG02 KG'
)
ON CONFLICT DO NOTHING;

-- Bouchons et bagues
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Bouchons et bagues'
AND mp.nom_pr IN (
    'Bouchon Tri-Sure 3/4 DFT PM',
    'Bouchon Tri-Sure 2 DFT GM',
    'Bague Tri-Sure 3/4 DFT PM',
    'Bague Tri-Sure 2 DFT GM',
    'Capsule G3/4 PM',
    'Capsule G2 PM',
    'Bouchon Paint Caps G2 GM',
    'Bouchon Paint Caps G3/4 PM',
    'Bouchon en Plastique 3/4 PM',
    'Bouchon en Plastique 2 GM'
)
ON CONFLICT DO NOTHING;

-- Matières citernes
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Matières citernes'
AND mp.nom_pr IN (
    'Bossage Jauge Senior',
    'Bossage Phase Liquide 1"1/4',
    'Bossage Phase Gazeuse 1" 1/4',
    'Bossage Clapet Porte Soupape 2"',
    'Bossage Orifice Vidange 3/4"',
    'Bossage Phase Liquide 3/4"',
    'Adaptateur Départ Gaz TE29',
    'Tube Plongeur',
    'Jauge Magnétique Senior',
    'Limiteur de Pression',
    'Détendeur Haute Pression',
    'Manomètre 0 à 40 bars'
)
ON CONFLICT DO NOTHING;

-- Autres consommables
INSERT INTO matiere_categorie (matiere_id, categorie_id)
SELECT mp.id_pr, c.id_categorie
FROM matiere_premiere mp
CROSS JOIN categorie c
WHERE c.nom_categorie = 'Autres consommables'
AND mp.nom_pr IN (
    'Perfect Seal LOWAC',
    'Poudre ABC',
    'Sacs Plastique P/R60L',
    'Sac Plastique Torique',
    'Bouchons Réservoirs P/R60L',
    'Dégraissant',
    'Enduit Pour Joint',
    'Epoxy Rouge',
    'Glyfer Économique',
    'Diluant Synthétique',
    'Catalyseur',
    'MARKYD'
)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION 8 : Stocks initiaux par magasin
-- Correction :
--   - JOIN sur magasin.id (pas de @Column sur la PK dans Magasin.java)
--   - JOIN sur magasin.nom_magasin (champ Java : nom, colonne SQL : nom_magasin)
--   - ON CONFLICT sur (magasin_id, matiere_id) conforme au UNIQUE du schéma
-- ============================================================

-- ---- MAGASIN BATNA ----
INSERT INTO stock (quantite_actuelle, gisement, magasin_id, matiere_id)
SELECT s.qte, s.gisement, mg.id, mp.id_pr
FROM (VALUES
    ('Tole BS2 1070x2,58 Import',          913.946, 'Zone stockage tôles – Batna'),
    ('Tole BS2 1070x2,58 SIDER',            44.350, 'Zone stockage tôles – Batna'),
    ('Tole BS2 910x3,30 Flan P35 IMP',      15.710, 'Zone stockage tôles – Batna'),
    ('Tole BS2 870x3,00 Import',            12.760, 'Zone stockage tôles – Batna'),
    ('Tole BS2 1100x3,30 Virole P35 IMP',    0.000, 'Zone stockage tôles – Batna'),
    ('Tole BS2 990x3,00 Import',             0.000, 'Zone stockage tôles – Batna'),
    ('Feuillard Collier 145x2,5mm',        125.660, 'Zone feuillards – Batna'),
    ('Feuillard Pied 85x3mm',              227.136, 'Zone feuillards – Batna'),
    ('Collerettes B13 & P35',             5165.000, 'Zone collerettes – Batna'),
    ('Collerettes SIRGHAZ',                682.000, 'Zone collerettes – Batna'),
    ('Grenaille d''Acier',                  16.550, 'Zone grenaille – Batna'),
    ('Flux de Soudure Pittarc FL182',        2.400, 'Zone soudure – Batna'),
    ('Fil de Zinc Ø4,76 mm',               32.000, 'Zone zinc – Batna'),
    ('Fil à Souder Ø1 mm',                  5.085, 'Zone fil soudure – Batna'),
    ('Fil à Souder Ø1,6 mm',               29.300, 'Zone fil soudure – Batna'),
    ('Fil à Souder Ø2,4 mm',               30.025, 'Zone fil soudure – Batna'),
    ('Peinture Epoxy Bleue',                7.420, 'Zone peintures – Batna'),
    ('Peinture Epoxy Noire',                1.420, 'Zone peintures – Batna'),
    ('Peinture Epoxy Orange',               0.900, 'Zone peintures – Batna'),
    ('Robinets B13&P35 NAFTAL',          4300.000, 'Zone robinetterie – Batna'),
    ('Dégraissant',                          2.500, 'Zone produits chimiques – Batna'),
    ('Enduit Pour Joint',                  179.000, 'Zone produits chimiques – Batna'),
    ('Encre Marabu UVGL122',               84.000, 'Zone encres – Batna'),
    ('Durcisseur UVHV8',                   22.000, 'Zone encres – Batna'),
    ('Diluant UVV6 – Batna',               97.000, 'Zone encres – Batna'),
    ('Sacs Plastique P/R60L',            7422.000, 'Zone emballage – Batna'),
    ('Sac Plastique Torique',             700.000, 'Zone emballage – Batna'),
    ('Bouchons Réservoirs P/R60L',       2600.000, 'Zone emballage – Batna'),
    ('Epoxy Rouge',                          0.040, 'Zone produits chimiques – Batna'),
    ('Glyfer Économique',                    0.163, 'Zone produits chimiques – Batna'),
    ('Diluant Synthétique',                  0.200, 'Zone produits chimiques – Batna')
) AS s(nom_mp, qte, gisement)
JOIN matiere_premiere mp ON mp.nom_pr = s.nom_mp
JOIN magasin mg ON mg.nom_magasin = 'Magasin MP – Batna'
ON CONFLICT (magasin_id, matiere_id) DO UPDATE SET
    quantite_actuelle = EXCLUDED.quantite_actuelle,
    date_mise_a_jour  = CURRENT_TIMESTAMP;

-- ---- MAGASIN ALGER ----
INSERT INTO stock (quantite_actuelle, gisement, magasin_id, matiere_id)
SELECT s.qte, s.gisement, mg.id, mp.id_pr
FROM (VALUES
    ('Tole BS2 1070x2,58 Import',        899.196, 'Entrepôt tôles – Alger'),
    ('Tole BS2 990x3,00 Import',           0.000, 'Entrepôt tôles – Alger'),
    ('Tole BS2 870x3,00 Import',           0.000, 'Entrepôt tôles – Alger'),
    ('Tole BS2 880x2,58 B6 Kg',          205.950, 'Entrepôt tôles – Alger'),
    ('Barre Laiton Ø14 mm',                4.838, 'Zone laiton – Alger'),
    ('Barre Laiton Ø16 mm',               12.792, 'Zone laiton – Alger'),
    ('Barre Laiton Ø25 mm',               89.956, 'Zone laiton – Alger'),
    ('Feuillard Pied 85x3 neuves',       304.021, 'Zone feuillards – Alger'),
    ('Feuillard Collier 145x2,5mm',        9.970, 'Zone feuillards – Alger'),
    ('Fil à Souder Ø1 mm',               38.760, 'Zone fil soudure – Alger'),
    ('Fil à Souder Ø1,2 mm',             16.545, 'Zone fil soudure – Alger'),
    ('Fil à Souder Ø2,4 mm',             28.600, 'Zone fil soudure – Alger'),
    ('Fil de Zinc Ø4,76 mm',              0.000, 'Zone zinc – Alger'),
    ('Fil de Zinc Ø3,17 mm',             90.000, 'Zone zinc – Alger'),
    ('Peinture Bleue à Poudre',            2.560, 'Zone peintures – Alger'),
    ('Peinture Blanche à Poudre',          4.005, 'Zone peintures – Alger'),
    ('Encre Jaune UVGL 122',             491.000, 'Zone encres – Alger'),
    ('Encre Bleu',                       159.000, 'Zone encres – Alger'),
    ('Diluant UVV6 – Batna',              40.000, 'Zone encres – Alger'),
    ('Perfect Seal LOWAC',              1297.000, 'Zone accessoires – Alger'),
    ('Joints Toriques',                17700.000, 'Zone joints – Alger'),
    ('Joints Auto Serreurs',            2400.000, 'Zone joints – Alger'),
    ('Pastilles en Nylon',              9600.000, 'Zone joints – Alger'),
    ('Goupilles d''Arrêt',            16500.000, 'Zone joints – Alger'),
    ('Limiteurs de Débit',              4770.000, 'Zone robinetterie – Alger'),
    ('Huile Emboutissage NAFTOCOM',    12240.000, 'Entrepôt huiles – Alger'),
    ('Grenaille d''Acier',               56.400, 'Zone grenaille – Alger'),
    ('Flux de Soudage Citerne',           6.600, 'Zone soudure – Alger'),
    ('Tole Acier 4000x3200x9mm',        489.000, 'Entrepôt tôles épaisses – Alger'),
    ('Fond Elliptique',                  231.000, 'Zone fonds – Alger')
) AS s(nom_mp, qte, gisement)
JOIN matiere_premiere mp ON mp.nom_pr = s.nom_mp
JOIN magasin mg ON mg.nom_magasin = 'Magasin MP – Alger'
ON CONFLICT (magasin_id, matiere_id) DO UPDATE SET
    quantite_actuelle = EXCLUDED.quantite_actuelle,
    date_mise_a_jour  = CURRENT_TIMESTAMP;

-- ---- MAGASIN MASCARA ----
INSERT INTO stock (quantite_actuelle, gisement, magasin_id, matiere_id)
SELECT s.qte, s.gisement, mg.id, mp.id_pr
FROM (VALUES
    ('Feuillard Pied 70x2,5mm',            3.050, 'Zone feuillards – Mascara'),
    ('Feuillard Pied 70x3mm',              9.025, 'Zone feuillards – Mascara'),
    ('Feuillard Collier 130x2mm B6',      53.960, 'Zone feuillards – Mascara'),
    ('Feuillard Collier 145x2,5mm',        8.810, 'Zone feuillards – Mascara'),
    ('Collerettes B13 & P35',              0.000, 'Zone collerettes – Mascara'),
    ('Collerettes SIRGHAZ',              340.000, 'Zone collerettes – Mascara'),
    ('Fil à Souder Ø1 mm',                 1.785, 'Zone fil soudure – Mascara'),
    ('Fil à Souder Ø2,4 mm',               2.300, 'Zone fil soudure – Mascara'),
    ('Fil de Zinc Ø4,76 mm',              21.000, 'Zone zinc – Mascara'),
    ('TSS Ø139,7x5mm (5-6 & 10kg CO2)',  163.045, 'Zone tubes – Mascara'),
    ('TSS Ø101,6x4mm (2kg CO2)',          13.597, 'Zone tubes – Mascara'),
    ('TSS Ø88,9x3,2mm (1 & 1,5kg CO2)',  25.612, 'Zone tubes – Mascara'),
    ('Peinture Orange à Poudre',           0.660, 'Zone peintures – Mascara'),
    ('Peinture Bleue à Poudre',            1.360, 'Zone peintures – Mascara'),
    ('Peinture Noire à Poudre',            0.660, 'Zone peintures – Mascara'),
    ('Grenaille d''Acier',                 2.750, 'Zone grenaille – Mascara'),
    ('Robinet complet PG 4/6/9 Kg',     5449.000, 'Zone robinetterie – Mascara'),
    ('Robinet PG50Kg',                   552.000, 'Zone robinetterie – Mascara'),
    ('Valve CO2 1-10 Kg',               1400.000, 'Zone valves – Mascara'),
    ('Joint Torique B03 KG',           56000.000, 'Zone joints – Mascara'),
    ('Joints Auto Serreurs',           60000.000, 'Zone joints – Mascara'),
    ('Pastilles en Nylon',             50000.000, 'Zone joints – Mascara'),
    ('Goupilles d''Arrêt',             20000.000, 'Zone joints – Mascara'),
    ('Limiteurs de Débit',             47000.000, 'Zone robinetterie – Mascara'),
    ('Piston P/Robinet B13 KG',        50800.000, 'Zone robinetterie – Mascara')
) AS s(nom_mp, qte, gisement)
JOIN matiere_premiere mp ON mp.nom_pr = s.nom_mp
JOIN magasin mg ON mg.nom_magasin = 'Magasin MP – Mascara'
ON CONFLICT (magasin_id, matiere_id) DO UPDATE SET
    quantite_actuelle = EXCLUDED.quantite_actuelle,
    date_mise_a_jour  = CURRENT_TIMESTAMP;

SELECT * FROM matiere_premiere;

-- ============================================================
-- VÉRIFICATION (optionnel)
-- ============================================================
/*
-- Vérifier les liaisons matière-catégorie
SELECT mp.nom_pr, c.nom_categorie
FROM matiere_categorie mc
JOIN matiere_premiere mp ON mp.id_pr = mc.matiere_id
JOIN categorie c ON c.id_categorie = mc.categorie_id
ORDER BY c.nom_categorie, mp.nom_pr;

-- Vérifier les stocks par magasin
SELECT mg.nom_magasin, mp.nom_pr, st.quantite_actuelle, mp.unite_mesure
FROM stock st
JOIN magasin mg ON mg.id = st.magasin_id
JOIN matiere_premiere mp ON mp.id_pr = st.matiere_id
ORDER BY mg.nom_magasin, mp.nom_pr;
*/
