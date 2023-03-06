(() => {
  const data = {
    backblaze: {
      minValue: 7,
      storagePrice: 0.005,
      transferPrice: 0.01,
    },
    bunny: {
      minValue: 0,
      maxValue: 10,
      storagePrice: 0.01,
      // storagePrice: {
      //   hdd: 0.01,
      //   ssd: 0.02,
      // },
      transferPrice: 0.01,
    },
    scaleway: {
      minValue: 0,
      storagePrice: 0.06,
      // storagePrice: {
      //   multi: 0.06, // 75 gb free
      //   single: 0.03, // 75gb free
      // },
      transferPrice: 0.02, //75gb free
    },
    vultr: {
      minValue: 5,
      storagePrice: 0.01,
      transferPrice: 0.01,
    },
  };

  const containerEl = document.querySelector(".container");

  const storageInput = document.getElementById("storage");
  const storageLabel = document.getElementById("storage_label");
  const transferInput = document.getElementById("transfer");
  const transferLabel = document.getElementById("transfer_label");

  const servicesEl = document.querySelectorAll(".services > div");

  let storageAmount = 0;
  let transferAmount = 0;

  const getAmount = ({ minValue, storagePrice, transferPrice }) => {
    const amount =
      storageAmount * storagePrice + transferAmount * transferPrice;

    return amount >= minValue ? amount : minValue;
  };

  const getHeight = ({ minValue, storagePrice, transferPrice, maxValue }) => {
    const step = maxValue
      ? maxValue / 100
      : (1000 * storagePrice + 1000 * transferPrice) / 100;
    const amount = getAmount({ minValue, storagePrice, transferPrice });

    return amount / step;
  };

  const getLowerPriced = nodeList => {
    let lowestPriced = nodeList[0];

    nodeList.forEach((elem, idx, arr) => {
      if (
        +elem.getAttribute("amount").replace("$", "") <
        +lowestPriced.getAttribute("amount").replace("$", "")
      ) {
        lowestPriced = elem;
      } else {
        elem.classList.remove("lowest");
      }
    });
    return lowestPriced.classList.add("lowest");
  };

  const updateUI = () => {
    Object.keys(data).forEach(key => {
      servicesEl.forEach(node => {
        if (node.id === key) {
          const { minValue, storagePrice, transferPrice } = data[key];

          node.style.height = `${getHeight({
            minValue,
            storagePrice,
            transferPrice,
          })}%`;
          let amount = `${Math.round(
            getAmount({ minValue, storagePrice, transferPrice })
          )}$`;
          node.setAttribute("amount", amount);
        }
      });
    });

    getLowerPriced(servicesEl);
  };

  const handleStorageChange = e => {
    storageLabel.innerText = `Storage ${e.target.value}`;
    storageAmount = +e.target.value;

    updateUI();
  };

  const handleTransferChange = e => {
    transferLabel.innerText = `Transfer ${e.target.value}`;
    transferAmount = +e.target.value;

    updateUI();
  };

  storageInput.addEventListener("input", handleStorageChange);

  transferInput.addEventListener("input", handleTransferChange);
})();
