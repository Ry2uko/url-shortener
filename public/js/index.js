const Validation = {
  validateUrl(urlString) {
    let url;
    
    try {
      url = new URL(urlString);
    } catch(err) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol == 'https:'; 
  },
  displayError(errType, e) {
    let message;

    switch(errType) {
      case 'no-url':
        message = "The link, please? ಠ_ಠ";
        break;
      case 'invalid-url':
        message = "Invalid URL";
        break;
      case 'invalid-len-id':
        message = "Invalid Id Length"
        break;
      case 'not-alphanumeric-id':
        message = "Id Not Alphanumeric"

    }

    $('.invalid-msg').text(message).css('color', '#d22d2d')
    return e.preventDefault();
  }
}

$(document).ready(function(){
  // Client-side Validation
  $('form').on('submit', (e) => {
    const url = $('#urlinput').val();
    const id = $('#idinput').val();
    const idRegex = new RegExp('^[a-zA-Z0-9]*$');

    let validateUrl = Validation.validateUrl,
    displayError = Validation.displayError;

    return url.length < 1 ? displayError('no-url', e)
    : !validateUrl(url) ? displayError('invalid-url', e)
    : id.length !== 5 && id.length !== 0 ? displayError('invalid-len-id', e)
    : !idRegex.test(id) ? displayError('not-alphanumeric-id', e)
    : "";
 
  });
  
  $('input[type="text"]').on('keypress', () => {
    $('.invalid-msg').text('easter bunny').css('color', '#fff');
  });
});