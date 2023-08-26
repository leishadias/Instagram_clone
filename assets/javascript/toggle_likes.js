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
            const urlParams = queryString[1].split('&');
            const id = urlParams[0].split('=')[1];
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                //check if already lliked or not
                if (data.data.deleted == true){
                    likesCount -= 1;
                    $(self).html(`<i class="fa-regular fa-heart"></i>`);
                }else{
                    likesCount += 1;
                    $(self).html(`<i class="fa-solid fa-heart" style="color: #e00606;"></i>`);
                }
                //update likes count
                $(self).attr('data-likes', likesCount);
                $(`#like-count-${id}`).html(`${likesCount} Likes`);
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
        });
    }
}
