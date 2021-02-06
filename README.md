Reaktor Junior Developer Pre-assignment (Summer 2021)

Intro:

    This is a web app created as the pre-assignment for Reaktor's Junior Developer application for summer 2021.

Technologies:
    
    This web app is entirely made with vanilla JavaScript.
    HTML and CSS are used for styling of the page but the web app works as a standalone JavaScript app.
    
How the app works:

    When you load the page, the app will automatically fetch all the product and manufacturer data available.
    When all data has been fetched, the app will show a dropdown menu that lets the user choose a product category.
    Based on the selection, the app finds the corresponding array and by default generates the first page of products in that category.
    Also based on the selection, the app looks at the size of the chosen array and generates the right amount of options
    in the page selection dropdown menu at the bottom of the screen.
    When you change the page, it will generate a brand new table of products, starting from the appropriate product.
    
    As allowed in the assignment, the page can be a bit slow at first load when it fetches all the data
    but after that, changing categories and pages is nice and fast.
    
Known issues:

    The app can at times receive a 403: Forbidden status code when trying to load the page.
    This error often disappears after some time and reappears randomly.

URL
    
    https://matiaskari.github.io/reaktorApp/reaktorApp.html

Author
    
    Matias Kari
