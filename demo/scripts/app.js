const konami = new Konami();

konami.init();

konami.listen(() => {
    document.getElementById('message').className = 'show';
});
