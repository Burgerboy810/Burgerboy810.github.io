$(function () {
    var APPLICATION_ID = "70CDCA87-AD80-3D7A-FF8E-96EDCA67FE00",
        SECRET_KEY = "4B52A421-67F4-E0D1-FF28-B15F619B2800",
        VERSION = "v1";
        
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
    
    if(Backendless.UserService.isValidLogin()) {
        userLoggedIn(Backendless.LocalCache.get("current-user-id"));
    } else {
        var loginScript = $("#login-template").html();
        var loginTemplate = Handlebars.compile(loginScript); 
        $('.main-container').html(loginTemplate);
    }
    
    $(document).on('submit', '.form-signin', function(event){
        event.preventDefault();
        
        var data = $(this).serializeArray(),
            email = data[0].value,
            password = data[1].value;
            
        Backendless.UserService.login(email, password, true, new Backendless.Async(userLoggedIn, gotError));
    });
    
    
    $(document).on('click', '.add-blog', function() {
        var addBlogScript = $("#add-blog-template").html();
        var addBlogTemplate = Handlebars.compile(addBlogScript);
    
        $('.main-container').html(addBlogTemplate);
          tinymce.init({ selector:'textarea' });
    });
    $(document).on('submit', '.form-add-blog', function (event){
        event.preventDefault();
        
        var data = $(this).serializeArray(),
            title = data[0].value,
            content = data[1].value;
            
        if(content === "" || title === "") {
            Materialize.toast('Empty title or Empty statment', 4000);
            }
            else {
        var dataStore = Backendless.Persistence.of(Posts);
        
        var postObject = new Posts({
            title: title,
            content: content,
            authorEmail: Backendless.UserService.getCurrentUser().email
        });
        
        dataStore.save(postObject);
        
        this.title.value = "";
        this.content.value = "";
            }
    });
    
    $(document).on('click', '.logout', function (){
       Backendless.UserService.logout(new Backendless.Async(userLoggedOut, gotError)); 
       
       var loginScript = $("#login-template").html();
       var loginTemplate = Handlebars.compile(loginScript); 
       $('.main-container').html(loginTemplate);
    });
});

function Posts (args) {
    args = args || {};
    this.title = args.title || "";
    this.content = args.content || "";
    this.authorEmail = args.authorEmail || "";
}

function userLoggedIn(user) {
    console.log("user succsessfully logged in");
    var userData;
    if (typeof user == "string"){
        userData = Backendless.Data.of(Backendless.User).findById(user);
    } else {
        userData = user;
    }
    var welcomeScript = $('#welcome-template').html();
    var welcomeTemplate = Handlebars.compile(welcomeScript);
    var welcomeHTML = welcomeTemplate(userData);
    
    $('.main-container').html(welcomeHTML);
}
function userLoggedOut(){
    console.log("succesfully logged out");
}

function gotError(error){
    Materialize.toast('!Wrong email or password!', 3000, 'rounded');
    console.log("Error message - " + error.message);
    console.log("Error code - " + error.code);
}