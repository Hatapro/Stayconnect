```mermaid
erDiagram
    USERS {
        int id
        string name
        string email
        string password
        string street
        string avatar
        bool isAdmin
    }

    CATEGORIES {
        int id_category
        string name
    }

    SUBCATEGORIES {
        int id_subcategory
        int id_category
        string name
    }

    PRODUCTS {
        int id
        string name
        string description
        int id_subcategory
    }

    VARIANTS {
        int id_variant
        int id_product
        string description
        int stock
        float price
    }

    ORDERS {
        int id
        float total
        string state
        int id_user
    }

    REVIEWS {
        int id_review
        int id_user
        int id_product
        string comment
        int score
    }

    USERS ||--o{ ORDERS : "perform"
    PRODUCTS }o--|| SUBCATEGORIES : "belongs"
    SUBCATEGORIES }o--|| CATEGORIES : "belongs"
    PRODUCTS ||--o{ VARIANTS : "has"
    USERS ||--o{ REVIEWS : "write"
    PRODUCTS ||--o{ REVIEWS : "has"
