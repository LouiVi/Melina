function isValidFileName(str)
{
    return !/[/.`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

//Create help buttons.
function CreateHelpButton( lay, id )
{
    btnHelp = app.CreateButton( "[fa-question]", -1, 0.1, "FontAwesome" );
    btnHelp.help = id;
    btnHelp.SetSize( 40, 40, "dp" );
    btnHelp.SetTextSize( 12 );
    btnHelp.SetTextColor( "#4285F4" );
    btnHelp.SetOnTouch( btn_OnHelp );
    lay.AddChild( btnHelp );
    return btnHelp;
}


"use strict"

function About()
{
    //Show about dialog.
    this.Show = function()
    {
        dlgPub.Show();
    }

    //Handle contact via email button.
    this.btnContact_OnTouch = function()
    {
         app.SendMail( "mycompany@mycompany.com", "MyCompany - Query", 
    		      "Please help me!" );
    }
    
    //Create dialog window.
    var dlgPub = app.CreateDialog( "About" );
    var layPub = app.CreateLayout( "linear", "vertical,fillxy" );
    layPub.SetPadding( 0.05, 0.05, 0.05, 0 );
    
    //Add an icon to top layout.
    var img = app.CreateImage( "Img/Hello.png", 0.2 );
    img.SetPosition( drawerWidth*0.06, 0.04 );
    layPub.AddChild( img );
    
    //Create a text with formatting.
    var text = "<p>This is my app " + 
        "<a href=http://www.google.com>My Link</a></p>";
    var txt = app.CreateText( text, 0.8, -1, "Html,Link" );
    txt.SetPadding( 0.03, 0.03, 0.03, 0 );
    txt.SetTextSize( 18 );
    txt.SetTextColor( "#444444" );
    layPub.AddChild( txt );
    
    //Create contact button.
    var btnContact = app.CreateButton( "Contact Us", 0.3, 0.1 );
    btnContact.SetMargins( 0,0,0,0.02 );
    btnContact.SetOnTouch( this.btnContact_OnTouch );
    layPub.AddChild( btnContact );
    
    //Add dialog layout and show dialog.
    dlgPub.AddLayout( layPub );
}


//Create an new file viewer object.
//(Note: a single instance of this object is used for all file data)
function File( path, layContent )
{
    var self = this;
    var name = "";
    var dfltImage = "Img/Icon.png";
    var dfltText = "";
    
    //Get page states.
    this.IsVisible = function() { return lay.IsVisible() }
    this.IsChanged = function() { return btnSave.IsEnabled() }
    
    //Show or hide this page.
    this.Show = function( show, title )
    {
        if( show ) 
        {
            name = title;
            self.Load();
            lay.Animate("FadeIn");
        }
        else lay.Animate( "FadeOut" );
    }
    
    //Load page settings from json file.
    this.Load = function()
    {
        //Read settings from json file.
        var file = path+"/"+name+"/"+name+".json";
        var json = app.ReadFile( file );
        
        if( json ) 
        {
            //Set controls.
            var data = JSON.parse(json);
            var dfltName = name ;
            img.SetImage( data.image ? data.image : dfltImage, img.GetWidth() );
            img.imageFile =  data.image ? data.image : dfltImage;
            
            txtNotes.SetText( data.text ? data.text : dfltText );
        }
        else self.Clear();
        
        btnSave.SetEnabled( false );
    }
    
    //Save page settings to json file.
    this.Save = function()
    {
        //Create settings object.
        var settings = 
        { 
            image : img.imageFile,
            text : txtNotes.GetText(),
        }
        
        //Write settings to file as json.
        var file = path+"/"+name+"/"+name+".json";
        app.WriteFile( file, JSON.stringify( settings ) );
        btnSave.SetEnabled( false );
    }
    
    //Clear page controls.
    this.Clear = function()
    {
        img.SetImage( dfltImage );
        img.imageFile =  dfltImage;
        
        txtNotes.SetText( dfltText );
    }
    
    //Swap image.
    this.OnImageChoose = function( file )
    {
        app.MakeFolder( path+"/"+name+"/Img" );
        var imageFile = path+"/"+name+"/Img/"+name+".png";
        app.CopyFile( file, imageFile );
        //app.GetThumbnail( file, imageFile, 340, 340 );
        img.SetImage( imageFile, 0.2,-1 );
        img.imageFile = imageFile;
        btnSave.SetEnabled( true );
    }
    
    //Handle image button.
    this.btnImage_OnTouch = function()
    {
        app.ChooseFile( "Choose Image", "image/*", self.OnImageChoose );
    }
    
    //Create layout for app controls.
    var lay = app.CreateLayout( "Linear", "FillXY,VCenter" );
    lay.Hide();
    layContent.AddChild( lay );
    
    //Create image label.
    var lab = app.CreateText( "Image" ); 
    lab.SetTextColor( "#4285F4" );
    lay.AddChild( lab );
    
    //Create horizontal layout.
    var layHoriz = app.CreateLayout( "Linear", "Horizontal" );
    layHoriz.SetMargins( 0, 0.02, 0, 0 );
    lay.AddChild( layHoriz );
    
    //Create a help button.
    btnHelp = CreateHelpButton( layHoriz, "image" );
    btnHelp.SetMargins( 0, 0.01, 0.14, 0 );
    
    //Create image.
	var img = app.CreateImage( dfltImage, 0.2, -1 );
	img.imageFile = dfltImage;
	layHoriz.AddChild( img );
	
	//Create a change image button.
    var btnImage = app.CreateButton( "[fa-refresh]", -1, 0.1, "FontAwesome" );
    btnImage.SetMargins( 0.08, 0.015, 0, 0 );
    btnImage.SetTextSize( 18 );
    btnImage.SetTextColor( "#555555" );
    btnImage.SetOnTouch( self.btnImage_OnTouch );
    layHoriz.AddChild( btnImage );
    
    //Create 'Notes' label.
    var lab = app.CreateText( "Notes" ); 
    lab.SetMargins( 0, 0.04, 0, 0 );
    lab.SetTextColor( "#4285F4" );
    lay.AddChild( lab );
    
    //Create help button.
    var layHoriz = app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild( layHoriz );
    btnHelp = CreateHelpButton( layHoriz, "notes" );
    btnHelp.SetMargins( 0, 0, 0.01, 0 );
    
    //Create notes edit control.
    var txtNotes = app.CreateTextEdit( "", 0.7 );
    txtNotes.SetOnChange( function(){btnSave.SetEnabled(true)} );
    layHoriz.AddChild( txtNotes );

    //Create a save button.
    var btnSave = app.CreateButton( "SAVE", 0.35, 0.1 );
    btnSave.SetMargins( 0,0.2,0,0 );
    btnSave.SetOnTouch( self.Save );
    lay.AddChild( btnSave );
}

//Show context help.
function btn_OnHelp()
{
    var txt = ""
    switch( this.help )
    {
        case "image": 
            txt = "This is a popup help box";
            app.ShowTip( txt, 0.25, 0.42); 
            break;
        case "notes": 
            txt = "This is where you type some notes etc...bla bla bla";
            app.ShowTip( txt, 0.15, 0.53 ); 
            break;
    }
}


//Create a Home object.
function Home( path, layContent )
{
		var self = this;
		var i;
    //Get page states.
    this.IsVisible = function() { return lay.IsVisible() }
    this.IsChanged = function() { return false }
    
    //Show or hide this page.
    this.Show = function( show )
    {
        if( show ) lay.Animate("FadeIn"), i = setInterval(self.Swap, 2250)
        else lay.Animate( "FadeOut" );
    }
    
    this.Swap = function ()
{
	if(img.Image == "Img/gettyimages-117012333-612x612-removebg-preview.png"){
		img.Image = "Img/gettyimages-117012363-612x612-removebg-preview.png";
	}else{
		img.Image = "Img/gettyimages-117012333-612x612-removebg-preview.png";
	}
	img.SetImage( img.Image, 1.175, -1, "Fixed,ScaleCenter,Resize,Alias" );
}

    
    //Create layout for app controls.
    var lay = app.CreateLayout( "Linear", "FillXY,VCenter" );
    lay.Hide();
    layContent.AddChild( lay );
    
    //Add a logo.
	var img = app.CreateImage( "Img/gettyimages-117012363-612x612-removebg-preview.png", 1.175, -1, "Fixed,ScaleCenter,Resize,Alias" );
	img.Image = "Img/gettyimages-117012363-612x612-removebg-preview.png";
	lay.AddChild( img );
	
	//Create a text with formatting.
    var text = "<p><font color=#4285F4><big>Welcome</big></font></p>" + 
    "Todo: Put your home page controls here! </p>" + 
    "<p>You can add links too - <a href=https://play.google.com/store>Play Store</a></p>" +
    "<br><br><p><font color=#4285F4><big><big><b>&larr;</b></big></big> Try swiping from the " + 
    "left and choosing the <b>'New File'</b> option</font></p>";
    var txt = app.CreateText( text, 1, -1, "Html,Link" );
    txt.SetPadding( 0.03, 0.03, 0.03, 0.03 );
    txt.SetTextSize( 14 );
    txt.SetTextColor( "#444444" );
    lay.AddChild( txt );
}


  