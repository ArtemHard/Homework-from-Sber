const db = {
    posts: [
        {
            photo: 'https://www.takefoto.ru/userfiles/image/Dlya%20Statey/07.04.2016/rezhim_peyzazh/rezhim_peyzazh_1.jpg',
            nickname: 'Ivan',
            header: 'Hi!',
            text: 'This is my first text on my first page',
        },
        {
            photo: 'https://avatars.mds.yandex.net/get-zen_doc/3122622/pub_5eabbd0b13284a1c2411369e_5eabbe2aec9bc44b276986cf/scale_1200',
            nickname: 'Sergey2000',
            header: 'New planet',
            text: 'yesterday, I\'ve looked to telescope and found a new planet in \"Cascad\" constellation',
        },
    ],
users: [
        {
            nickname: 'test',
            email: 'v1@mail.ru',
            password: 1234,
        },
    ],

}

module.exports = {
    db,
}