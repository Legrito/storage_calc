(() => {
  const data = {
    backblaze: {
      minValue: 7,
      storagePrice: 0.005,
      transferPrice: 0.01,
      discount: 0,
    },
    bunny: {
      minValue: 0,
      maxValue: 10,
      storagePrice: 0.01,
      transferPrice: 0.01,
      discount: 0,
    },
    scaleway: {
      minValue: 0,
      storagePrice: 0.03,
      transferPrice: 0.02,
      discount: 75,
    },
    vultr: {
      minValue: 5,
      storagePrice: 0.01,
      transferPrice: 0.01,
      discount: 0,
    },
  };

  const storageInput = document.getElementById("storage");
  const storageLabel = document.getElementById("storage_label");
  const transferInput = document.getElementById("transfer");
  const transferLabel = document.getElementById("transfer_label");

  const servicesEl = document.querySelectorAll(".services > div");
  const formsEl = document.querySelectorAll(".storage-form");

  let storageAmount = 0;
  let transferAmount = 0;

  const getAmount = ({
    minValue,
    storagePrice,
    transferPrice,
    discount,
    maxValue,
  }) => {
    const amount =
      (storageAmount - discount) * storagePrice +
      (transferAmount - discount) * transferPrice;

    if (maxValue) {
      return amount < minValue
        ? minValue
        : amount > maxValue
        ? maxValue
        : amount;
    } else {
      return amount < minValue ? minValue : amount;
    }
  };

  const getHeight = ({
    minValue,
    storagePrice,
    transferPrice,
    maxValue,
    key,
  }) => {
    if (key === "scaleway" && storageAmount <= 75 && transferAmount <= 75) {
      return 0;
    }
    const { discount } = data[key];
    const step = maxValue
      ? maxValue / 100
      : (1000 * storagePrice -
          discount * storagePrice +
          (1000 * transferPrice - discount * transferPrice)) /
        100;
    let amount;
    if (key === "scaleway" && storageAmount <= 75) {
      amount = getAmount({
        minValue,
        storagePrice: 0,
        transferPrice,
        discount,
      });
    } else if (key === "scaleway" && transferAmount <= 75) {
      amount = getAmount({
        minValue,
        storagePrice,
        transferPrice: 0,
        discount,
      });
    } else {
      amount = getAmount({
        minValue,
        storagePrice,
        transferPrice,
        discount,
        maxValue,
      });
    }
    return amount > maxValue ? maxValue / step : amount / step;
  };

  const getLowerPriced = nodeList => {
    let lowestPriced = nodeList[0];

    nodeList.forEach(elem => {
      if (
        +elem.getAttribute("amount")?.replace("$", "") <
        +lowestPriced.getAttribute("amount")?.replace("$", "")
      ) {
        lowestPriced = elem;
      } else {
        elem.classList.remove("lowest");
      }
    });

    return lowestPriced.classList.add("lowest");
  };

  const clean = node => {
    node.removeAttribute("amount");
    node.style.height = "0";
  };

  const updateUI = () => {
    Object.keys(data).forEach(key => {
      servicesEl.forEach(node => {
        if (storageAmount === 0 && transferAmount === 0) {
          return clean(node);
        }
        if (node.id === key) {
          const { minValue, storagePrice, transferPrice, maxValue, discount } =
            data[key];
          const elemHeight = getHeight({
            minValue,
            storagePrice,
            transferPrice,
            maxValue,
            key,
          });
          node.style.height = `${elemHeight}%`;
          let amount =
            elemHeight === 0
              ? "0$"
              : `${getAmount({
                  minValue,
                  storagePrice,
                  transferPrice,
                  maxValue,
                  discount,
                }).toFixed(2)}$`;
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

  formsEl.forEach(el =>
    el.addEventListener("change", e => {
      data[e.target.name].storagePrice = +e.target.value;
      updateUI();
    })
  );

  storageInput.addEventListener("input", handleStorageChange);

  transferInput.addEventListener("input", handleTransferChange);
})();
