class ProductList extends React.Component {
  state = {
    products: [],
    productRegistry: null,
    gas: 1e6,
    transactionSender: null
  };

  componentDidMount = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    this.setState({ transactionSender: web3.eth.accounts[0] });

    await window.loadBuildArtifacts();

    const networkId = await window.getNetwork(web3);
    const ProductRegistryArtifacts = window.buildArtifacts['ProductRegistry'];
    const abi = ProductRegistryArtifacts.abi;
    const address = ProductRegistryArtifacts.networks[networkId].address;
    const contract = web3.eth.contract(abi).at(address);
    this.setState({ productRegistry: contract });
    console.log(contract);

    window.contract = contract;
    window.web3 = web3;

    await this.loadProducts();
  }

  handleProductUpVote = async (productId) => {
    await this.state.productRegistry.voteForProduct(
      productId, { from: this.state.transactionSender, gas: this.state.gas }
    );

    // Client side interaction
    const nextProducts = this.state.products.map((product) => {
      if (product.id === productId) {
        return Object.assign({}, product, {
          votes: product.votes + 1,
        });
      } else {
        return product;
      }
    });
    this.setState({
      products: nextProducts,
    });
  }

  addProduct = async (title, description, submitter, image) => {
    const productImage = 'images/products/image-' + image;
    const avatarImage = 'images/avatars/' + submitter;
    const transactionHash = await this.state.productRegistry.addProduct(
      title, description, avatarImage, productImage, // contract function input parameters
      { from: this.state.transactionSender, gas: this.state.gas }  // transaction options
    );
    console.log(transactionHash);
    
    await this.sleep(500);  // Wait for transaction to be mined
    await this.loadProducts();
  }
  
  loadProducts = async () => {
    let product;
    let products = [];
    const productCount = contract.productCount();

    for (let i = 0; i < productCount; i++) {
      product = await contract.products(i);
      products.push({
        id: i,
        title: product[0],
        description: product[1],
        submitterAvatarUrl: product[2],
        productImageUrl: product[3],
        votes: product[4].toNumber(),
      });
    }
    this.setState({ products: products });
  }

  render = () => {
    const products = this.state.products.sort((a, b) => (
      b.votes - a.votes
    ));

    const productComponents = products.map((product) => (
      <Product
        key={product.id}
        id={product.id}
        title={product.title}
        description={product.description}
        url='#'
        votes={product.votes}
        submitterAvatarUrl={product.submitterAvatarUrl}
        productImageUrl={product.productImageUrl}
        onVote={this.handleProductUpVote}
      />
    ));
    return (
      <div>
        <div className='ui unstackable items'>
          {productComponents}
        </div>
        <AddProductForm onAddProduct={this.addProduct} />
      </div>
    );
  }

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class Product extends React.Component {
  handleUpVote = () => this.props.onVote(this.props.id);

  render() {
    return (
      <div className='item'>
        <div className='image'>
          <img src={this.props.productImageUrl} />
        </div>
        <div className='middle aligned content'>
          <div className='header'>
            <a onClick={this.handleUpVote}>
              <i className='large caret up icon' />
            </a>
            {this.props.votes}
          </div>
          <div className='description'>
            <a href={this.props.url}>{this.props.title}</a>
            <p>{this.props.description}</p>
          </div>
          <div className='extra'>
            <span>Submitted by:</span>
            <img
              className='ui avatar image'
              src={this.props.submitterAvatarUrl}
            />
          </div>
        </div>
      </div>
    );
  }
}

class AddProductForm extends React.Component {
  state = {
    title: '',
    description: '',
    submitter: 'emily.jpg',
    image: 'aqua.png',
  };
  
  onFormSubmit = (event) => {
    event.preventDefault();
    const { title, description, submitter, image } = this.state;
    this.props.onAddProduct(title, description, submitter, image);
  };

  onChange = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    this.setState({ [id]: value });  // use value of id as the state key
  }

  render = () =>  {
    return (
        <div>
          <h1>Add New Product</h1>  

          <form onSubmit={this.onFormSubmit}>
            <label>Title:</label><input required={true} type="text" id="title" onChange={this.onChange}/>
            <label>Description:</label><input required={true} type="text" id="description" onChange={this.onChange}/>
            
            <label>Submitter:</label>
            <select id="submitter" onChange={this.onChange}>
              <option value="emily.jpg">Emily</option>
              <option value="liz.png">Liz</option>
              <option value="adam.jpg">Adam</option>
              <option value="sarah.png">Sarah</option>
            </select>

            <label>Product Image:</label>
            <select id="image" onChange={this.onChange}>
              <option value="aqua.png">Aqua</option>
              <option value="rose.png">Rose</option>
              <option value="steel.png">Steel</option>
              <option value="yellow.png">Yellow</option>
            </select>

            <input type='submit' />
          </form>
        </div>
    );
  }
}

ReactDOM.render(
  <ProductList />,
  document.getElementById('content')
);  