-- =============================================
-- Assignment 2 SQL Queries
-- Database: PostgreSQL
-- Author: Archford
-- Date: 18 May 2025
-- =============================================

-- Create a custom ENUM type for assignment tracking
-- This helps categorize different components of the database
CREATE TYPE public.assignment2 AS ENUM
    ('account', 'inventory', 'classification');

-- Set ownership of the type to the 'chimbo' user
-- This ensures proper permissions for the type
ALTER TYPE public.assignment2
    OWNER TO chimbo;

-- =============================================
-- TASK 1: Account Management Operations
-- =============================================

-- Insert a new record into the account table
-- Note: account_id is auto-generated and account_type has a default value
INSERT INTO account (
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password
)
VALUES (
    'Tony', 
    'Stark', 
    'tony@starkent.com', 
    'Iam1ronM@n'
);

-- Update Tony Stark's account type to Admin
-- Using both first and last name for precise identification
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' 
  AND account_lastname = 'Stark';

-- Delete the Tony Stark record
-- Cleanup after completing the admin tasks demonstration
DELETE FROM account
WHERE account_firstname = 'Tony' 
  AND account_lastname = 'Stark';

-- =============================================
-- TASK 2: Inventory Description Update
-- =============================================

-- Update GM Hummer description using REPLACE function
-- Changes "small interiors" to "a huge interior" without full retyping
UPDATE inventory
SET inv_description = REPLACE(
    inv_description, 
    'small interiors', 
    'a huge interior'
)
WHERE inv_make = 'GM' 
  AND inv_model = 'Hummer';

-- Verification query for the GM Hummer update
SELECT inv_description 
FROM inventory 
WHERE inv_make = 'GM' 
  AND inv_model = 'Hummer';

-- =============================================
-- TASK 3: Classification Join Operation
-- =============================================

-- Retrieve sport vehicles using INNER JOIN
-- Combines inventory and classification tables
SELECT 
    inv_make, 
    inv_model, 
    classification_name
FROM inventory
INNER JOIN classification 
    ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- =============================================
-- TASK 4: Inventory Image Path Updates
-- =============================================

-- Update all inventory image paths
-- Adds '/vehicles' to the existing image paths
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');