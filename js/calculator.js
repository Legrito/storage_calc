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
      transferPrice: 0.01,
    },
    scaleway: {
      minValue: 0,
      storagePrice: 0.03, // 75gb for free
      transferPrice: 0.02, //75gb free
    },
    vultr: {
      minValue: 5,
      storagePrice: 0.01,
      transferPrice: 0.01,
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

  const getAmount = ({ minValue, storagePrice, transferPrice, maxValue }) => {
    const amount =
      storageAmount * storagePrice + transferAmount * transferPrice;

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
    const step = maxValue
      ? maxValue / 100
      : (1000 * storagePrice + 1000 * transferPrice) / 100;
    let amount;
    if (key === "scaleway" && storageAmount <= 75) {
      amount = getAmount({ minValue, storagePrice: 0, transferPrice });
    } else if (key === "scaleway" && transferAmount <= 75) {
      amount = getAmount({ minValue, storagePrice, transferPrice: 0 });
    } else {
      amount = getAmount({ minValue, storagePrice, transferPrice, maxValue });
    }
    return amount > maxValue ? maxValue / step : amount / step;
  };

  const getLowerPriced = nodeList => {
    let lowestPriced = nodeList[0];

    nodeList.forEach((elem, idx, arr) => {
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
          const { minValue, storagePrice, transferPrice, maxValue } = data[key];

          node.style.height = `${getHeight({
            minValue,
            storagePrice,
            transferPrice,
            maxValue,
            key,
          })}%`;
          let amount = `${Math.round(
            getAmount({ minValue, storagePrice, transferPrice, maxValue })
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

  formsEl.forEach(el =>
    el.addEventListener("change", e => {
      data[e.target.name].storagePrice = +e.target.value;
      updateUI();
    })
  );

  storageInput.addEventListener("input", handleStorageChange);

  transferInput.addEventListener("input", handleTransferChange);
})();
