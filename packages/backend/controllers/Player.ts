import Game from "../models/Game";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "superhardstring";

export const join = async (req: Request, res: Response) => {
  try {
    const { inviteCode, playerAddress } = req.body;
    const game = await Game.findOne({ inviteCode });

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    if (game.status !== "ongoing") {
      return res.status(400).json({ error: "Game is not ongoing." });
    }

    if (game.players.length >= game.maxPlayers) {
      return res.status(400).json({ error: "Game is full." });
    }

    if (game.players.includes(playerAddress)) {
      return res.status(200).json(game); // Player is already in the game
    }

    let token;

    if (JWT_SECRET) token = jwt.sign({ address: playerAddress }, JWT_SECRET);

    game.players.push(playerAddress);
    const savedGame = await game.save();
    return res.status(200).json({ token, game: savedGame });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const leave = () => {};

export const sweepPrize = () => {};
export const markSlotsAsFoundPerPlayer = () => {};
