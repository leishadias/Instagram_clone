const searchModal = document.getElementById('searchlist');

//filters items from the list based on what is typed
function filterFunction() {
  let input, filter, div, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("searchlist");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

//when search is open, the item in the nav bar to be highlighted and removed on class
searchModal.addEventListener('shown.bs.modal', () => {
  $('#searchBtnList').addClass('temporary-highlight');
});

searchModal.addEventListener('hidden.bs.modal', () => {
  $('#searchBtnList').removeClass('temporary-highlight');
});