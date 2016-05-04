$(function () {
    var APPLICATION_ID = "70CDCA87-AD80-3D7A-FF8E-96EDCA67FE00",
        SECRET_KEY = "4B52A421-67F4-E0D1-FF28-B15F619B2800",
        VERSION = "v1";
        
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
   
    var postsCollection = Backendless.Persistence.of(Posts).find();
  
    console.log(postsCollection);
    
    var wrapper = {
        posts: postsCollection.data
    };
    
    Handlebars.registerHelper('format', function (time) {
        return moment(time).format('dddd, MMM Do YYYY');
    });
    
    var blogScript = $("#blogs-template").html();
    var blogTemplate = Handlebars.compile(blogScript);
    var blogHTML = blogTemplate(wrapper);
    
    $('.main-container').html(blogHTML);
});

function Posts (args) {
    args = args || {};
    this.title = args.title || "";
    this.content = args.content || "";
    this.authorEmail = args.authorEmail || "";
}
$(document).on('click', '.deleteA',function (event){
   Backendless.Persistence.of(Posts).remove(event.target.attributes.data.nodeValue);
   Materialize.toast('Deleted', 3000, 'rounded');
   location.reload();
});