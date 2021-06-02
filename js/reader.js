var categories = ['all'];

function InitPosts() {
    if (location.hash) {
        ShowPosts(location.hash.substr(1));
    }
}

function ShowPosts(tag){
    // Custom version of ShowPosts for Medium posts in RSS
    for (var x=0; x < categories.length; x++){
        var posts = document.getElementsByClassName(categories[x]);

        if (tag == 'all' || categories[x] == tag) {
            SetVisibility(posts);
        }
        else {
            SetVisibility(posts, display="none");
        }
    }
}

function SetVisibility(posts, display="") {
    for(var y=0; y < posts.length; y++) {
        posts[y].style.display = display;
    }
}

function RSSReader(src, img=0, desc=0) {
    $.ajax({
        url: src,
        dataType: "xml",
        type: "GET",
        success: function (xml) {
            $.each($("item", xml), function(i, e) {
                // Read XML data
                var c = $(e).find("category").text();
                if (c !== '' && categories.indexOf(c) === -1){
                    categories.push(c);
                    $(".topics").append('<li><a href="#' + c + '" onclick="ShowPosts(\'' + c + '\');">' + c + '</a></li>');
                }

                var imgHTML = (img > 0) ? '<img src="' + $(e).find("image").text() + '" class="post_img">' : '';
                var descHTML = (desc > 0) ? "<p>" + $(e).find("description").text() + "</p>" : '';

                var post = '';
                post += '<tr class="post_wrapper all '+ c + '"><td>';
                post += imgHTML;
                post += '<div class="post_preview">';
                post += '<div class="post_title">';
                post += '<a href="'+ $(e).find("link").text() + '">'+ $(e).find("title").text() + '</a>';
                post += '</div>';
                post += '<div class="post_date" style="color:' + Config.date_color + ';">'+ $(e).find("pubDate").text() + '</div>';
                post += descHTML;
                post += '</div></td></tr>';
                $("#BlogPosts tbody").append(post);

            });
            // Create Datatable
            $('#BlogPosts').dataTable({
                "paging": true,
                "searching":false,
                "sorting":false,
                "info":false,
                "pageLength":10,
                "bLengthChange": false
            });
            // Topics
            InitPosts();
        },
   });
}

function JSONReader(src, img=0, desc=0) {
    $.ajax({
        url: src,
        dataType: "json",
        type: "GET",
        success: function(data) {
            $.each(data, function(i, e) {
                var c = e["category"];
                if (c !== '' && categories.indexOf(c) === -1){
                    categories.push(c);
                    $(".topics").append('<li><a href="#' + c + '" onclick="ShowPosts(\'' + c + '\');">' + c + '</a></li>');
                }

                var imgHTML = (img > 0) ? '<img src="' + e["image"] + '" class="post_img">' : '';
                var descHTML = (desc > 0) ? "<p>" + e["description"] + "</p>" : '';

                var post = '';
                post += '<tr class="post_wrapper all '+ c + '"><td>';
                post += imgHTML;
                post += '<div class="post_preview">';
                post += '<div class="post_title">';
                post += '<a href="'+ e["link"] + '">'+ e["title"] + '</a>';
                post += '</div>';
                post += '<div class="post_date" style="color:' + Config.date_color + ';">'+ e["date"] + '</div>';
                post += descHTML;
                post += '</div></td></tr>';
                $("#BlogPosts tbody").append(post);
            })
            // Create Datatable
            $('#BlogPosts').dataTable({
                "paging": true,
                "searching":false,
                "sorting":false,
                "info":false,
                "pageLength":10,
                "bLengthChange": false
            });
            // Topics
            InitPosts();
        },
    });
}
