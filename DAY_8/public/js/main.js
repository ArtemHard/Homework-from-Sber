// const socket = new WebSocket(window.location.origin.replace('http', 'ws'));

const $fetchDeletePostBtn = document.querySelector("[data-delete]");

const $signUpForm = document.forms.signupform;
const $newPostForm = document.forms.newpostform;

if ($newPostForm) {
  console.log("work");

  const $headerText = document.querySelector("[data-header]");
  const $postText = document.querySelector("[data-postText]");
  const $linkPhoto = document.querySelector("[data-linkPhoto]");

  const LSKey = "addNewPost";

  const dataFromLS = JSON.parse(window.localStorage.getItem(LSKey));
  if (dataFromLS) {
    $headerText.value = dataFromLS.header;
    $postText.value = dataFromLS.text;
    $linkPhoto.value = dataFromLS.photo;
  }

  $headerText.addEventListener("input", (e) => {
    const oldData = JSON.parse(window.localStorage.getItem(LSKey));

    const objectForSave = {
      ...oldData,
      [e.target.name]: e.target.value,
    };

    window.localStorage.setItem(LSKey, JSON.stringify(objectForSave));
  });

  $postText.addEventListener("input", (e) => {
    const oldData = JSON.parse(window.localStorage.getItem(LSKey));

    const objectForSave = {
      ...oldData,
      [e.target.name]: e.target.value,
    };

    window.localStorage.setItem(LSKey, JSON.stringify(objectForSave));
  });

  $linkPhoto.addEventListener("input", (e) => {
    const oldData = JSON.parse(window.localStorage.getItem(LSKey));

    const objectForSave = {
      ...oldData,
      [e.target.name]: e.target.value,
    };

    window.localStorage.setItem(LSKey, JSON.stringify(objectForSave));
  });
}

if ($signUpForm) {
  const $emailInput = $signUpForm.elements.email;
  const $nameInput = $signUpForm.elements.nickname;

  const LSKey = "signUpForm";

  const dataFromLS = JSON.parse(window.localStorage.getItem(LSKey));

  if (dataFromLS) {
    $emailInput.value = dataFromLS.email;
    $nameInput.value = dataFromLS.nickname;
  }

  $emailInput.addEventListener("input", (e) => {
    // console.log(e.target.value)

    const oldData = JSON.parse(window.localStorage.getItem(LSKey));
    // console.log({ oldData })

    const objectToSave = {
      ...oldData,
      [e.target.name]: e.target.value,
    };

    window.localStorage.setItem(LSKey, JSON.stringify(objectToSave));
  });

  $nameInput.addEventListener("input", (e) => {
    const oldData = JSON.parse(window.localStorage.getItem(LSKey));
    // console.log({ oldData })

    const objectToSave = {
      ...oldData,
      [e.target.name]: e.target.value,
    };

    window.localStorage.setItem(LSKey, JSON.stringify(objectToSave));
  });
}

if ($fetchDeletePostBtn) {
  $fetchDeletePostBtn.addEventListener("click", (e) => {
    console.log(e.target);
    fetch("/fetch/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Date.now() }), // id поста
    }).then((response) => {
      console.log({ response });
    });
  });
}
