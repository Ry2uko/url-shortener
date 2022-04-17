$(document).ready(function(){
  $('#clipboardCopy').on('click', () => {
    let input = $('#shortenedlink')[0];

    input.select();
    input.setSelectionRange(0, 99999); // Mobile

    navigator.clipboard.writeText(input.value);
    input.blur();
  });
});