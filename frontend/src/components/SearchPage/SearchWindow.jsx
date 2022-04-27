import { useEffect, useState } from "react";
import axios from "axios";
import { Cards } from "./Cartes";
import "@components/SearchPage/SearchWindow.scss";

const cocktailDataRaw = [
  {
    strDrink: "Screaming Orgasm",
    strCategory: "Ordinary Drink",
    strAlcoholic: "Alcoholic",
    strGlass: "Cocktail glass",
    strInstructions:
      "Pour first vodka, then Bailey's, then Kahlua into a cocktail glass over crushed ice. Stir. Caution: use only high quality vodka. Cheap vodka can cause the Bailey's to curdle. Test your brand of vodka by mixing 1 Tsp each of vodka and Bailey's first.",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/x894cs1504388670.jpg",
    strIngredient1: "Vodka",
    strIngredient2: "Baileys irish cream",
    strIngredient3: "Kahlua",
    strIngredient4: "",
    strIngredient5: "",
  },
];

const letterBar = () => {
  const response = [];
  /* eslint-disable-next-line */
  for (let i = 65; i !== 91; i++) {
    response.push(String.fromCharCode(i));
  }
  return response;
};

const SearchWindow = () => {
  const [searchField, setSearchField] = useState(""); // Search field input value
  const [cocktailList, setCocktailList] = useState(cocktailDataRaw); // Actual list of drinks
  const [numberFiltered, setNumberFiltered] = useState(false); // Drinks names starts by a number
  const [currentLetter, setCurrentLetter] = useState(""); // Current filter by letter
  const [filtered, setFiltered] = useState(false); // Is there any filter active ?

  const [maxItem, setMaxItem] = useState(10);
  const [minItem, setMinItem] = useState(0);

  // Goes to "first page" by setting array offset to 0
  const firstPage = () => {
    setMinItem(0);
    setMaxItem(10);
  };
  // Goes to "last page" by setting array offset to array.length
  const lastPage = () => {
    setMinItem(cocktailList.length - 10);
    setMaxItem(cocktailList.length);
  };
  // Offsets display of array by -10 after checking if possible (first page won't offset)
  const prevPage = () => {
    if (minItem <= 10) {
      setMinItem(0);
      setMaxItem(10);
    } else {
      setMinItem(minItem - 10);
      setMaxItem(maxItem - 10);
    }
  };
  // Offsets display of array by +10 after checking if possible (last page won't offset)
  const nextPage = () => {
    if (maxItem >= cocktailList.length - (cocktailList.length % 10)) {
      setMinItem(cocktailList.length - 10);
      setMaxItem(cocktailList.length);
    } else {
      setMinItem(minItem + 10);
      setMaxItem(maxItem + 10);
    }
  };

  // Fetches all drinks from API using "?s=" without any parameters, kinda weird ut it works
  async function getAllDrinks() {
    const response = await axios
      .get("https://www.thecocktaildb.com/api/json/v2/9973533/search.php?s=")
      .then((data) => data.data.drinks)
      .catch((err) => {
        console.error(err);
      });

    if (response) {
      firstPage();
      return response;
    }
    return [];
  }

  // Fetches the whole drink lists and apply a filters to keep only the ones with names starting by a number
  const startsWithNumber = () => {
    getAllDrinks().then((data) =>
      setCocktailList(
        data.filter(
          (item) =>
            item.strDrink.charCodeAt(0) >= 48 &&
            item.strDrink.charCodeAt(0) <= 57
        )
      )
    );
    setNumberFiltered(true);
    setFiltered(true);
  };

  // Fetches API with "?f=" parameter to recover only drinks starting with the specified letter
  async function getDrinkByLetter(letter) {
    const response = await axios
      .get("https://www.thecocktaildb.com/api/json/v2/9973533/search.php", {
        params: { f: letter },
      })
      .then((data) => data.data.drinks)
      .catch((err) => {
        console.error(err);
      });

    if (response) {
      firstPage();
      setFiltered(true);
      return response;
    }
    return [];
  }

  // Resets filters to display all drinks
  const resetFilters = () => {
    if (currentLetter !== "") {
      setCurrentLetter("");
    }
    if (numberFiltered) {
      setNumberFiltered(false);
    }
    setFiltered(false);
  };

  // Checks filtering state and handles letter filtering requests
  useEffect(() => {
    if (currentLetter === "" && numberFiltered === false) {
      setFiltered(false);
    } else {
      setFiltered(true);
    }

    if (currentLetter === "" && numberFiltered === false) {
      getAllDrinks().then((data) => setCocktailList(data));
    } else {
      getDrinkByLetter(currentLetter).then((data) => setCocktailList(data));
    }
  }, [currentLetter]);

  /* eslint-disable */
  return (
    <section className="searchContainer">
      <div className="searchBar">
        <ul className="searchList">
          <li>Cocktail Type</li>
          <li>Alcohol</li>
          <li>Ingredients</li>
          <li>Glass Type</li>
          <li className="inputList">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchField(e.target.value)}
            />
          </li>
        </ul>
      </div>

      <ul className="letterBar">
        <p className="counter">{cocktailList.length} results</p>
        <p
          className={filtered ? "rmFilters" : "hide"}
          onClick={() => resetFilters()}
        >
          Remove Filters
        </p>
        {letterBar().map((letter) => {
          return (
            <li onClick={() => setCurrentLetter(letter)} key={letter}>
              {letter}
            </li>
          );
        })}
        <li onClick={() => startsWithNumber()}>0-9</li>
      </ul>
      <ul className="pageBar">
        <li onClick={() => firstPage()}>{`<!`}</li>
        <li onClick={() => prevPage()}>{`<-`}</li>
        <li onClick={() => nextPage()}>{`->`}</li>
        <li onClick={() => lastPage()}>{`!>`}</li>
      </ul>

      <div className="cardsContainer">
        {cocktailList
          .filter((item) =>
            item.strDrink.toLowerCase().includes(searchField.toLowerCase())
          )
          .slice(minItem, maxItem)
          .map((item) => {
            // eslint-disable-next-line
            return <Cards {...item} key={item.idDrink} />;
          })}
      </div>
      <ul className="pageBar">
        <li onClick={() => firstPage()}>{`<!`}</li>
        <li onClick={() => prevPage()}>{`<-`}</li>
        <li onClick={() => nextPage()}>{`->`}</li>
        <li onClick={() => lastPage()}>{`!>`}</li>
      </ul>
    </section>
  );
};

export default SearchWindow;