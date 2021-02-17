const backdrop = document.querySelector('.backdrop')
const sideDrawer = document.querySelector('.mobile-nav')
const menuToggle = document.querySelector('#side-menu-toggle')

function backdropClickHandler() {
  backdrop.style.display = 'none'
  sideDrawer.classList.remove('open')
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block'
  sideDrawer.classList.add('open')
}

backdrop.addEventListener('click', backdropClickHandler)
menuToggle.addEventListener('click', menuToggleClickHandler)

const onDeleteClick = (btn) => {
  const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value
  const productId = btn.parentNode.querySelector('[name=productId]').value

  console.dir()
  btn.closest('article').remove()
  fetch('/admin/delete-product/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrfToken,
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error))
}
