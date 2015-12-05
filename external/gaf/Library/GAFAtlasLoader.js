/**
 * Created by admiral on 19.02.2015.
 */

gaf._AtlasLoader = {};
gaf._AtlasLoader.execute = function(condition, success, fail)
{
    condition() ? success() : fail();
};

gaf._AtlasLoader.checkAtlas = function(atlas) // curried function
{
    return function(){return atlas && typeof atlas !== "string" && atlas.isLoaded()};
};

gaf._AtlasLoader.load = function(path, success, fail)
{
    cc.textureCache.addImage(path, function(atlas){
        gaf._AtlasLoader.execute(
            gaf._AtlasLoader.checkAtlas(atlas),
            function(){success(atlas)},
            fail
        );
    });
};

gaf._AtlasLoader.loadFront = function(arr, success, fail)
{
    // Call recursively this function for each element starting from the first
    // stops on first success, or fails after last element
    return function()
    {
        if (arr.length > 0){
            gaf._AtlasLoader.load(
                arr[0],
                success,
                gaf._AtlasLoader.loadFront(
                    arr.slice(1),
                    success,
                    fail
        ));}
        else
            fail();
    }
};

gaf._AtlasLoader.loadArray = function(array, success, fail)
{
    gaf._AtlasLoader.loadFront(array, success, fail)();
};
