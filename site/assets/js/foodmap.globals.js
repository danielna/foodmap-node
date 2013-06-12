
define(["jquery"],
    
    function($) {

        var foodmap = foodmap || {};

        foodmap._globals = {
            listing_width: 145,
            map_icons:  {
                            "low"   :   "assets/img/icon_green.png",
                            "med"   :   "assets/img/icon_yellow.png",
                            "high"  :   "assets/img/icon_red.png"
                        },
            price_map:  {
                            "low"   :   "Cheap Eats",
                            "med"   :   "Moderately Priced",
                            "high"  :   "Expensive"
                        },
            initial_zoom: 10,
            container_welcome: $("#container-welcome")
        };

    return foodmap._globals;
    
    }
);
