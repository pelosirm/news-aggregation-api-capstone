
//handle source selection 
function handleSourceInput(){

    $( "select" )
        .change(function () {
            let str = "";
            let formattedString = ''
            $( "select option:selected" ).each(function() {
                str += $( this ).val();
                formattedString = $(this).text()

            });
        $('.source-query').html(formattedString)
        getSourceResult(str)
        $('.news-content').show();
        scrollTop()

    })


}

// handle search query
function handleSearchInput() {
   
    $(".search-form").on('submit', function (e) {
          event.preventDefault()

          let query = $('#search-input').val()
          $('.intro-info').hide();
          $('.news-content').show();
          $('#search-input').val('')
          getSearchResult(query)
          $('.source-query').html(query)
          $('.page').text(1)
          scrollTop();

    });
}


// handle additional request
function handleMoreResults() {
    $('.get-more-results').on('click', function() {
        $('.intro-info').hide();


        let query = $('.source-query').text()
        let int = parseInt($('.page').text()) + 1

        getMoreResults(query,int)

        $('.page').text(int)

        scrollTop();

    })
}

function openPage() {
    $('.news-content').hide()
}

function topOfPage() {
    $('#top').on('click',function(){
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    })
}

function backToMain() {
    $('a').on('click',function(){
        location.reload();
        $('.intro-info').show()
        $('.news-content').hide()
    })
}

function scrollTop() {
    $("html, body").animate({
        scrollTop: $('#newsResponse').offset().top - 100
    });
}

function testImage(URL) {
    let imgSrc = ''
    
    if (URL == null) {
        imgSrc = 'http://commoncdn.entrata.com/images/jquery/galleria/image-not-found.png'
    } else {
        imgSrc = URL
    }

    return imgSrc
}

function createHtmlOutput(results) {

    let articles = results.articles
    let htmlOutput = ''
    let rowHtml = '<div class="row">'

    for (let i = 0; i < articles.length; i++) {


            rowHtml += '<div class="col-3">'
            rowHtml += '<img src="' + testImage(articles[i].urlToImage) +'">'
            rowHtml += '<p>' + articles[i].title +' <br><br><span class="light">' + articles[i].description +'</span></p>'
            rowHtml += '</div>'

            if (i && ((i+1) % 4 === 0) || i === articles.length - 1) {

                rowHtml += '</div>'
                htmlOutput += rowHtml
                rowHtml = '<div class="row">'
            }

    }

     $(".news-articles").html(htmlOutput);

}

//api call for sources

function getSourceResult(source) {
    var result = $.ajax({
        url: "https://newsapi.org/v2/top-headlines?sources="+source+"&apiKey=96a8250a853b4599892825738ac6954c",
        type: 'GET',
        dataType: "json"
    })
    
    .done(function(result) {
        let resultArticles = result
        createHtmlOutput(resultArticles)
        
    })
    
    .fail(function(jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });

}

function getSearchResult(query) {
    var result = $.ajax({
        url: 'https://newsapi.org/v2/everything?q="'+query+'"&language=en&apiKey=96a8250a853b4599892825738ac6954c',
        type: 'GET',
        dataType: "json"
    })
    
    .done(function(result) {
        let resultArticles = result
        console.log(resultArticles)
        createHtmlOutput(resultArticles)

        
    })
    
    .fail(function(jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });

}

function getMoreResults(query,int) {
    var result = $.ajax({
        url: 'https://newsapi.org/v2/everything?q="'+query+'"&language=en&page='+int+'&apiKey=96a8250a853b4599892825738ac6954c',
        type: 'GET',
        dataType: "json"
    })
    
    .done(function(result) {
        let resultArticles = result
        console.log(resultArticles)
        createHtmlOutput(resultArticles)

        
    })
    
    .fail(function(jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });

}


function runApp() {
    openPage()
    handleSourceInput()
    handleSearchInput() 
    handleMoreResults()
    topOfPage()
    backToMain()

}

$(runApp)