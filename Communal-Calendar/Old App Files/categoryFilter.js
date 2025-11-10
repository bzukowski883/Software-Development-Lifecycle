window.addEventListener('DOMContentLoaded', () => {
//Grabs the filter menu and the box (Box can be changed later)
  const filterMenu = document.querySelector('.filterMenuStuff');
  const box1 = document.getElementById('box1');

//Listens for when changes are made to the filter menu
  filterMenu.addEventListener('change', (event) => {
    const checkbox = event.target;

    //If statements to check if each checkbox is checked or not
    if (checkbox.classList.contains('category1')) {
      if (checkbox.checked) {
        box1.style.backgroundColor = 'lightblue';
      } else {
        box1.style.backgroundColor = 'white';
      }
    }

    if (checkbox.classList.contains('category2')) {
      if (checkbox.checked) {
        box1.textContent = 'Cat2';
      } else {
        box1.textContent = '1';
      }
    }

    if (checkbox.classList.contains('category3')) {
        if (checkbox.checked) {
            alert('Category3 toggled!');
        } else {
            box1.style.border = 'none';
        }
    }
  });
});