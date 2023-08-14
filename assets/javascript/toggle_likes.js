class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;
            //fetch post id
            const queryString = $(self).attr('href').split('?');
            // console.log("link",queryString);
            const urlParams = queryString[1].split('&');
            const id = urlParams[0].split('=')[1];
            console.log(id);
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    $(self).html(`<i class="fa-regular fa-heart"></i>`);
                }else{
                    likesCount += 1;
                    $(self).html(`<i class="fa-solid fa-heart" style="color: #e00606;"></i>`);
                }
                $(self).attr('data-likes', likesCount);
                console.log(`like-count-${id}`);
                $(`#like-count-${id}`).html(`${likesCount} Likes`);
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
        });

    }
}
