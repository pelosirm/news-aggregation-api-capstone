

// functions that deal with page movement

function openPage() {
    $('.news-content').hide()
}

function hideIntro() {
    $('.intro-info').hide();
}

function showNews() {
    $('.news-content').show();
}

function scrollTop() {
    $("html, body").animate({
        scrollTop: $('#newsResponse').offset().top - 100
    });
}

//test image for null if it doesn't exist, then image not found

function testImage(URL) {
    let imgSrc = ''
    
    if (URL == null) {
        imgSrc = 'http://commoncdn.entrata.com/images/jquery/galleria/image-not-found.png'
    } else {
        imgSrc = URL
    }

    return imgSrc
}

//create html output for api response

function createHtmlOutput(results) {

    let articles = results.articles
    let htmlOutput = ''
    let rowHtml = '<div class="row">'

    for (let i = 0; i < articles.length; i++) {


            rowHtml += '<div class="col-4">'
            rowHtml += '<a href="' + articles[i].url + '" target="_blank"'+ 'aria-label="'+articles[i].title+'">'
            rowHtml += '<div class="news-image" style="background-image: url(' + testImage(articles[i].urlToImage) + ')"></div>';
            rowHtml += '</a>'
            rowHtml += '<p>' + articles[i].title +' <br><br><span class="light">' + articles[i].description +'</span>'
            rowHtml += '<br><br>'
            rowHtml += 'Source: ' + articles[i].source.name + '</p>'
            rowHtml += '</div>'

            //every third iteration close row div and reset 

            if (i && ((i+1) % 3 === 0) || i === articles.length - 1) {

                rowHtml += '</div>'
                htmlOutput += rowHtml
                rowHtml = '<div class="row">'
            }

    }

    //update DOM with news articles
     $(".news-articles").html(htmlOutput);

}

//api call for sources

// get top headlines from a certain source
function getSourceResult(source) {
    var result = $.ajax({
        url: "https://newsapi.org/v2/top-headlines?sources="+source+"&apiKey=96a8250a853b4599892825738ac6954c",
        type: 'GET',
        dataType: "json"
    })
    
    .done(function(result) {
        //html output response
        createHtmlOutput(result)
    
    })
    
    .fail(function(jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });

}


//get search results
function getSearchResult(query) {
    var result = $.ajax({
        url: 'https://newsapi.org/v2/top-headlines?q='+query+'&language=en&sortBy=popularity&apiKey=96a8250a853b4599892825738ac6954c',
        type: 'GET',
        dataType: "json"
    })
    
    .done(function(result) {

        createHtmlOutput(result)

    })
    
    .fail(function(jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });

}

//get additional results by page
function getMoreResults(query,int) {
    var result = $.ajax({
        url: 'https://newsapi.org/v2/everything?q="'+query+'"&language=en&page='+int+'&apiKey=96a8250a853b4599892825738ac6954c',
        type: 'GET',
        dataType: "json"
    })
    
    .done(function(result) {
        createHtmlOutput(result)
    })
    
    .fail(function(jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });

}


$(document).ready(function () {

    openPage()
    // trigger events 

    // handle source input

    $( "select" )
        .change(function () {

            //define input values
            let selected = $( "select option:selected" ).val()
            let formattedSelected = $( "select option:selected" ).text()

            $('.source-query').html(formattedSelected)
            $('.page-details').hide()
            
            //get results from api
            getSourceResult(selected)

            //handle screen
            showNews()
            scrollTop()

    })

    //handle search input
    $(".search-form").on('submit', function (e) {
          event.preventDefault()

          let query = $('#search-input').val()

          hideIntro()
          showNews()
          //reset search input value 
          $('#search-input').val('')
          //get results from api
          getSearchResult(query)
          $('.page-details').show()
          $('.source-query').html(query)
          $('.page').text(1)
          scrollTop();

    });

    //reach out for more search results 
    $('.get-more-results').on('click', function() {

        let int = parseInt($('.page').text()) + 1
        let query = $('.source-query').text()
            getMoreResults(query,int)

        $('.page').text(int)

        scrollTop();

    })

    // scroll to top of page
    $('#top').on('click',function(){
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    })

    //go home and reload page
    $('.navbar a').on('click',function(){
        location.reload();
        $('.intro-info').show()
        $('.news-content').hide()
    })

});


