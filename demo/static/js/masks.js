 $(function () {


     hideLoading("#graph_loading_overlay")



     //  layerModalSelector = document.querySelector("[data-dropdown]")
     //  layerModal = CarbonComponents.Dropdown.create(layerModalSelector)

     var similarityBlock1, similarityBlock5
     //  $(".masktabcontent").html($("#generated").html())
     $("#generated").show()

     $("div.masktab").click(function () {
         $(".masktab").removeClass("maskactive")
         $(this).addClass("maskactive")

         $(".tabcontent").hide();
         clickedTab = $(this).attr("tab")
         $("#" + clickedTab).fadeIn("slow")

         //  $(".masktabcontent").hide().html($("#" + clickedTab).html()).fadeIn("slow")

     })

     function loadImages() {
         $(".ganimagebox").empty()
         for (i = 0; i < 100; i++) {

             $imagebox = $("<div id='" + i + "' class='iblock'>" +
                 "<img class='imageresultimg eachimagebox cursorable expandable' src= 'static/assets/images/generated/" + i + ".jpg" + "' id= '" + i + "' data-title= '" + i + "'data-id='" + i + "'/>" + "</div>");
             $(".ganimagebox").append($imagebox)
             //  console.log($imagebox.html())
         }

         setTimeout(function () {
             $(".imageresultimg").first().click()
             //  console.log("Clickkk", $(".imageresultimg").first().attr("id"))
         }, 1200)
     }

     function loadImageData(layerName) {
         $.ajax({
             url: "static/assets/images/dataset/" + layerName + ".json",
             type: "GET",
             contentType: "application/json",
         }).done(function (result) {
             if (layerName == "block1_pool") {
                 similarityBlock1 = result
             } else {
                 similarityBlock5 = result
             }
             console.log("Block data loaded")
             // imageself.parent().fadeOut()
             // $(".hoverrig").hide()
         }).fail(function (xhr, status, error) {
             showNotification("Server Error. ", status, error + ". You might have to try again later.")
         });

     }

     loadImageData("block1_pool")
     loadImageData("block5_pool")
     //  console.log("Block data ", similarityBlock1.length, similarityBlock5.length)

     loadImages()


     // Click event for images
     $('body').on('click', '.imageresultimg', function () {
         //  console.log($(this).attr("data-id"), "clicked")
         $(".imageresultimg").removeClass("imageactive")
         $(this).addClass("imageactive");
         imageId = $(this).attr("data-id")
         getSimilarity(imageId)
     });

     // Click event for layerdropdown
     $('body').on('click', '.layertab', function () {
         //  console.log("changed text", $(this).text())
         $("div.layertab").removeClass("layertabactive")
         $(this).addClass("layertabactive");
         imageId = $(".imageresultimg.imageactive").attr("data-id")
         appendSimilarImages(imageId)
     });

     function updateSimilarImages(imageID) {
         appendSimilarImages(imageId)

     }
     //  $(".layerdropdown#layerdropdown").click()

     function appendSimilarImages(imageId) {
         selectedLayer = $(".layertab.layertabactive").attr("id")
         //  console.log("selected laer", selectedLayer)
         if (selectedLayer == "block1_pool") {
             similarImages = similarityBlock1[imageId]
         } else {
             similarImages = similarityBlock5[imageId]
         }
         //  similarImages = getSimilarImages()
         $(".similarcontent").empty()
         similarImages.forEach(each => {
             $imagebox = $("<div id='" + i + "' class='similareachimagebox iblock'>" +
                 "<img class='similarimg eachimagebox' src= 'static/assets/images/dataset/images/" + each.id + ".jpg" + "' data-title= '" + each.id + "'data-id='" + each.id + "'  />" +
                 // "<div class='imghovermenubar'> <div class='imagehovermenu'>save</div></div>" + 
                 "</div>");
             $(".similarcontent").append($imagebox)
         });
         //  $(".similarcontent").fadeOut("slow", function () {

         //      $(this).fadeIn("slow")
         //  })

     }

     function getSimilarity(imageId) {

         $(".similarimagebox").slideUp("slow", function () {
             appendSimilarImages(imageId)
             $maincontent = $("<img class='mainimg' src= 'static/assets/images/generated/" + imageId + ".jpg" + "' data-title= '" + imageId + "'data-id='" + imageId + "'  />")
             $(".mainimagecontent").html($maincontent)
             //  console.log(similarImages)
             $(".similarimagebox").css('opacity', 0)
                 .slideDown('slow')
                 .animate({
                     opacity: 1
                 }, {
                     queue: false,
                     duration: 'slow'
                 });
         })
     }

     //  // Hover event for images
     //  $('body').on('mouseenter', '.imageresultimg', function () {
     //      lastHoverTime = new Date();
     //      console.log("hover", lastHoverTime)
     //      $(".hoverrig").show()
     //      // alert($(this).parent().find(".imagehovermenu").html())
     //      $(this).parent().find(".imagehovermenu").show();
     //      imgurl = $(this).attr("src")
     //      leftOffset = ($(this).offset().left + $(this).width() + $(".hoverrigimg").innerWidth()) > $(window).width() ? ($(this).offset().left - $(".hoverrigimg").innerWidth() - 10) : ($(this).offset().left + $(this).width() + 10)
     //      topOffset = ($(this).offset().top - $(document).scrollTop() + $(".hoverrigimg").innerWidth()) > $(window).height() ? ($(this).offset().top - $(".hoverrigimg").innerWidth() + $(this).height()) : $(this).offset().top
     //      // console.log($(document).scrollTop(), ($(this).offset().top + $(".hoverrigimg").innerWidth() ).toFixed(2) , $(window).height()   )
     //      $(".hoverrigimg").attr("src", imgurl)
     //      $(".hoverigcaption").text($(this).attr("data-title"));
     //      $("div.hoverrig").offset({
     //          left: leftOffset,
     //          top: topOffset
     //      });

     //      // console.log($(this).attr("data-title"))
     //  });


 });