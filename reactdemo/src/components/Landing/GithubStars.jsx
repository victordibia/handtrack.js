import React from "react";

const GithubStars = ({ version }) => {
  return (
    <div className="  ">
      <a
        className="inline-block pr-2"
        target="_blank"
        rel="noreferrer"
        href="https://github.com/victordibia/handtrack.js/stargazers"
      >
        <img
          alt="GitHub stars"
          src="https://img.shields.io/github/stars/victordibia/handtrack.js?style=social"
        />
      </a>
    </div>
  );
};

export default GithubStars;
