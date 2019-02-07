$(function () {

    datasetList = ['152.jpg', '6315.jpg', '748.jpg', '610.jpg', '2895.jpg', '314.jpg', '681.jpg', '104.jpg', '7117.jpg', '616.jpg', '5319.jpg', '308.jpg', '157.jpg', '1710.jpg', '5197.jpg', '6171.jpg', '3722.jpg', '6286.jpg', '128.jpg', '7872.jpg', '8473.jpg', '3181.jpg', '7062.jpg', '7593.jpg', '640.jpg', '171.jpg', '2306.jpg', '5481.jpg', '7587.jpg', '8550.jpg', '4619.jpg', '15.jpg', '272.jpg', '2046.jpg', '895.jpg', '4936.jpg', '5019.jpg', '2227.jpg', '4662.jpg', '3672.jpg', '2158.jpg', '7158.jpg', '1223.jpg', '9149.jpg', '6477.jpg', '3543.jpg', '2715.jpg', '6109.jpg', '5544.jpg', '8518.jpg', '201.jpg', '1932.jpg', '930.jpg', '6666.jpg', '78.jpg', '5791.jpg', '720.jpg', '2315.jpg', '5441.jpg', '483.jpg', '4636.jpg', '5413.jpg', '4756.jpg', '6551.jpg', '6470.jpg', '5918.jpg', '178.jpg', '2074.jpg', '827.jpg', '4953.jpg', '1630.jpg', '7016.jpg', '3769.jpg', '6523.jpg', '2472.jpg', '433.jpg', '1285.jpg', '2679.jpg', '3219.jpg', '3011.jpg', '653.jpg', '4835.jpg', '8439.jpg', '7716.jpg', '1395.jpg', '1921.jpg', '3135.jpg', '156.jpg', '6441.jpg', '7632.jpg', '4280.jpg', '1614.jpg', '3269.jpg', '1989.jpg', '3720.jpg', '4723.jpg', '4855.jpg', '495.jpg', '7811.jpg', '1707.jpg', '6422.jpg', '3107.jpg', '4912.jpg', '3025.jpg', '1129.jpg', '3636.jpg', '7367.jpg', '4837.jpg', '1134.jpg', '5272.jpg', '8110.jpg', '38.jpg', '147.jpg', '8141.jpg', '1771.jpg', '1039.jpg', '7859.jpg', '3792.jpg', '1384.jpg', '3309.jpg', '8261.jpg', '1559.jpg', '7310.jpg', '7650.jpg', '1598.jpg', '1795.jpg', '92.jpg', '1959.jpg', '1071.jpg', '3956.jpg', '1312.jpg', '2801.jpg', '8752.jpg', '5124.jpg', '2335.jpg', '6161.jpg', '6588.jpg', '350.jpg', '2492.jpg', '3328.jpg', '175.jpg', '352.jpg', '5149.jpg', '9060.jpg', '3350.jpg', '4192.jpg', '950.jpg', '8968.jpg', '7153.jpg', '1240.jpg', '7841.jpg', '2462.jpg', '4411.jpg', '853.jpg', '8004.jpg', '612.jpg', '760.jpg', '4489.jpg', '373.jpg', '130.jpg', '3922.jpg', '7675.jpg', '5485.jpg', '1353.jpg', '4959.jpg', '3787.jpg', '4613.jpg', '5074.jpg', '1065.jpg', '7287.jpg', '663.jpg', '7958.jpg', '664.jpg', '2043.jpg', '3012.jpg', '905.jpg', '6417.jpg', '3796.jpg', '221.jpg', '8794.jpg', '615.jpg', '1178.jpg', '7179.jpg', '3055.jpg', '6525.jpg', '2792.jpg', '500.jpg', '4819.jpg', '4001.jpg', '7029.jpg', '28.jpg', '4398.jpg', '1912.jpg', '4557.jpg', '1324.jpg', '1307.jpg', '8519.jpg', '6249.jpg', '71.jpg', '4908.jpg']
    numberArray = Array.from(Array(200).keys())

    console.log(numberArray)

    function loadSampleDataset() {
        datasetList.forEach(each => {
            $imagebox = $("<div id='" + each + "' class='sampleimagebox iblock'>" +
                "<img class='sampleimg eachimagebox expandable' src= 'static/assets/images/dataset/images/" + each + "' data-title= '" + each + "'data-id='" + each + "'  />" +
                // "<div class='imghovermenubar'> <div class='imagehovermenu'>save</div></div>" + 
                "</div>");
            $(".datasetsamplebox").append($imagebox)
        });
    }

    function loadGenDataset() {
        $(".gen64box").fadeOut(function () {
            $(this).empty()
            numberArray = shuffle(numberArray)
            numberArray = numberArray.slice(0, 30)
            numberArray.forEach(each => {
                // each = index
                $imagebox = $("<div id='" + each + "' class='sampleimagebox iblock'>" +
                    "<img class='sampleimg eachimagebox expandable' src= 'static/assets/images/gens128/" + each + ".jpg' data-title= '" + each + "'data-id='" + each + "'  />" +
                    // "<div class='imghovermenubar'> <div class='imagehovermenu'>save</div></div>" + 
                    "</div>");
                $(".gen64box").append($imagebox).fadeIn()
            });

        })

    }

    $(".loadmore128button").click(function () {
        loadGenDataset()
    })

    loadSampleDataset()
    loadGenDataset()


    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
});