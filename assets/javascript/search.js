function filterFunction() {
    var input, filter, ul, li, a, i;
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

  // const myModal = document.getElementById('search-btn')
  const searchModal = document.getElementById('searchlist')
  
  searchModal.addEventListener('shown.bs.modal', () => {
    console.log("shown");
    $('#searchBtnList').addClass('temporary-highlight');
  });

  searchModal.addEventListener('hidden.bs.modal', () => {
    console.log("hide");
    $('#searchBtnList').removeClass('temporary-highlight');
  })

  