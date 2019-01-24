window.Seed = (function () {
  function generateVoteCount() {
    return Math.floor((Math.random() * 50) + 15);
  }

  const products = [
    {
      id: 1,
      title: 'Digi-Collectibles',
      description: 'The rarest digital collectibles.',
      votes: generateVoteCount(),
      submitterAvatarUrl: 'images/avatars/adam.jpg',
      productImageUrl: 'images/products/image-aqua.png',
    },
    {
      id: 2,
      title: 'Cats+',
      description: 'Cat toys, grooming and day care.',
      votes: generateVoteCount(),
      submitterAvatarUrl: 'images/avatars/sarah.png',
      productImageUrl: 'images/products/image-rose.png',
    },
    {
      id: 3,
      title: 'Software R Us',
      description: 'Your premier software development shop.',
      votes: generateVoteCount(),
      submitterAvatarUrl: 'images/avatars/emily.jpg',
      productImageUrl: 'images/products/image-steel.png',
    },
    {
      id: 4,
      title: 'Our Planet',
      description: 'Concerned about the planet?  Come talk to us.',
      votes: generateVoteCount(),
      submitterAvatarUrl: 'images/avatars/liz.png',
      productImageUrl: 'images/products/image-yellow.png',
    },
  ];

  return { products: products };
}());
