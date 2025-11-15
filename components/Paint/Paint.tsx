'use client';

import styles from './paint.module.scss';

import {
  RiArrowGoBackFill,
  RiArrowGoForwardFill,
  RiDeleteBinLine,
  RiEraserFill,
  RiPaintFill,
  RiPaletteLine,
  RiPencilFill,
  RiSave3Fill,
} from 'react-icons/ri';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import NextImage from 'next/image';

import { useGlobalContext } from '@/context';
import { FormField } from '@/components/FormField';
import { PopUp } from '@/components/PopUp';
import { Button } from '@/components/Button';

import SQUARES from './empty.json';

enum Mode {
  DRAW,
  ERASE,
  FILL,
}

interface Square {
  i: number; // row
  j: number; // column
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  color: string;
  filled: boolean;
}

export function Paint() {
  const GRID_COLOR: string = '#EEEEEE';
  const GRID_STROKE: string = '#DDDDDD';
  const GRID_SIZE: number = 600;
  const SQUARE_SIZE: number = 20; // pixels
  const SQUARES_PER_ROW: number = GRID_SIZE / SQUARE_SIZE;
  const INITIAL_SQUARES = JSON.parse(JSON.stringify(SQUARES));

  const colorPicker = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToast } = useGlobalContext();
  const [step, setStep] = useState(-1);
  const [history, setHistory] = useState<string[]>([JSON.stringify(SQUARES)]);
  const [squares, setSquares] = useState<Square[][]>(SQUARES);
  const [mode, setMode] = useState<Mode>(Mode.DRAW);
  const [movingActive, setMovingActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [validationEnabled, setValidationEnabled] = useState(false);

  /**
   * Change of the mode - DRAW, ERASE, FILL
   * @param m
   */
  function modeChange(m: Mode) {
    setMode(m);
  }

  /**
   * Hide or show the toolbar
   */
  function toggleToolbar() {
    setIsToolbarOpen(!isToolbarOpen);
  }

  /**
   * Open the color picker
   */
  function handeColorBtnClick() {
    colorPicker?.current?.click();
  }

  /**
   * Change the color
   * @param event
   */
  function handleColorChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedColor(event.target.value);
  }

  /**
   * Stop of the movement
   */
  function stopDrawing() {
    setMovingActive(false);
    addToHistory(canvasCtx);
  }

  /**
   * Draw on the canvas
   * @param clientX
   * @param clientY
   * @param isClick
   */
  function draw(clientX: number, clientY: number, isClick: boolean) {
    if (canvasCtx && (movingActive || isClick)) {
      const rect = canvasCtx.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const square: Square | null = determineSquare(x, y);

      if (mode === Mode.FILL) {
        fillCanvas(canvasCtx, squares[0][0], square, selectedColor, false);
      } else if (mode === Mode.DRAW) {
        drawSquare(canvasCtx, square, selectedColor, false);
      } else if (mode === Mode.ERASE) {
        drawSquare(canvasCtx, square, GRID_COLOR, true);
      }
    }
  }

  /**
   * Clear entire canvas and start over
   */
  function clearCanvas(context: CanvasRenderingContext2D | null) {
    if (context) {
      reDraw(INITIAL_SQUARES, context);
      addToHistory(context);
    }
  }

  /**
   * Determine which square is clicked. Initially square is 30x30 pixels
   * @param x coordinate clicked in the canvas
   * @param y coordinate clicked in the canvas
   */
  function determineSquare(x: number, y: number): Square | null {
    let s: Square | null = null;
    for (const row of squares) {
      for (const square of row) {
        if (x >= square.startX && x <= square.endX && y >= square.startY && y <= square.endY) {
          s = square;
        }
      }
    }
    return s;
  }

  /**
   * Draw one square usually 30x30 on desktop
   * @param context canvas context
   * @param square usually 30x30 on desktop
   * @param color of the square
   * @param drawEmpty fill stroke when grid rendering or when using the eraser
   */
  function drawSquare(
    context: CanvasRenderingContext2D,
    square: Square | null,
    color: string,
    drawEmpty: boolean,
  ) {
    if (square) {
      updateSquares(square, color, drawEmpty);

      context.fillStyle = color;
      context.fillRect(square.startX, square.startY, SQUARE_SIZE, SQUARE_SIZE);

      if (drawEmpty) {
        context.strokeStyle = GRID_STROKE;
        context.strokeRect(square.startX, square.startY, SQUARE_SIZE, SQUARE_SIZE);
      }
    }
  }

  /**
   * Fill entire canvas with the selected color. e.g. if you click on the red colored square,
   * and you want to fill in with blue, find all the reds and change it to blue.
   * @param context
   * @param square
   * @param clickedSquare
   * @param color of one square
   * @param drawEmpty fill stroke when grid rendering or when using the eraser
   */
  function fillCanvas(
    context: CanvasRenderingContext2D,
    square: Square | null,
    clickedSquare: Square | null,
    color: string,
    drawEmpty: boolean,
  ) {
    if (square && clickedSquare) {
      if ((clickedSquare.color !== color && square.color === clickedSquare.color) || drawEmpty) {
        drawSquare(context, square, color, drawEmpty);
      }
      if (square.i < SQUARES_PER_ROW - 1) {
        fillCanvas(context, squares[square.i + 1][square.j], clickedSquare, color, drawEmpty);
      } else {
        fillCanvas(context, squares[0][square.j + 1], clickedSquare, color, drawEmpty);
      }
    }
  }

  /**
   * Update the squares in state based on the square we are updating
   * @param square usually 30x30 on desktop
   * @param color of the square
   * @param isEmpty on load and when using the eraser
   */
  function updateSquares(square: Square, color: string, isEmpty: boolean) {
    const copy = [...squares];
    copy[square.i][square.j] = {
      ...square,
      filled: !isEmpty,
      color,
    };
    setSquares(copy);
  }

  /**
   * Add the current step to history so it will be revertible
   * @param context
   */
  function addToHistory(context: CanvasRenderingContext2D | null) {
    if (context) {
      const newStep = step + 1;
      setStep(newStep);
      if (newStep < history.length) {
        history.length = newStep;
      }
      setHistory((h) => [...h, JSON.stringify(squares)]);
    }
  }

  /**
   * Go step backward
   */
  function undo() {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      reDraw(JSON.parse(history[prevStep]), canvasCtx);
    }
  }

  /**
   * Gp step forward
   */
  function redo() {
    if (step < history.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      reDraw(JSON.parse(history[nextStep]), canvasCtx);
    }
  }

  /**
   * Load squares from json file
   * @param path to the squares json
   * @param context canvas context
   */
  function loadFromJson(path: string, context: CanvasRenderingContext2D | null) {
    fetch(path)
      .then((response) => response.json())
      .then((json) => reDraw(json, context));
  }

  /**
   * Redraw entire canvas
   * @param newSquares
   * @param context
   */
  function reDraw(newSquares: Square[][], context: CanvasRenderingContext2D | null) {
    if (!context) {
      return;
    }

    for (const row of newSquares) {
      for (const square of row) {
        drawSquare(context, square, square.color, !square.filled);
      }
    }
    setSquares(newSquares);
  }

  /**
   * Handle the 'on enter key' event on the name field
   */
  async function handleNameEnterKey() {
    if (buttonDisabled) {
      return;
    }
    save();
  }

  /**
   * Handle the 'on blur' event on the name field
   */
  function handleNameBlur() {
    // on blur always start with validation
    setValidationEnabled(true);
    validateName(name);
  }

  /**
   * Handle the 'on change' event on the name field
   * @param event input change event
   */
  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    setName(value);
    // start validating when name has more than 7 characters
    if (validationEnabled || value.length >= 7) {
      setValidationEnabled(true);
      validateName(value);
    }
  }

  /**
   * Validate the name field in the save PopUp
   * @param value name
   */
  function validateName(value: string) {
    if (value.length < 7) {
      setButtonDisabled(true);
      setErrorMsg('Name must contain at least 7 characters.');
      return;
    }
    if (value.match(/[^a-zA-Z0-9*\s]/)) {
      setButtonDisabled(true);
      setErrorMsg('Only latin characters (a-z A-Z) numbers, star and space allowed.');
      return;
    }
    setButtonDisabled(false);
    setErrorMsg('');
  }

  /**
   * Check if there is at least one empty square
   */
  function hasEmptySquares(): boolean {
    for (const row of squares) {
      for (const square of row) {
        if (!square.filled) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Save drawing
   */
  function save() {
    if (hasEmptySquares()) {
      addToast({
        type: 'error',
        message: 'There are empty squares. Entire canvas needs to be drawn.',
      });
      setShowPopUp(false);
      return;
    }

    if (canvasCtx) {
      canvasCtx.canvas.toBlob(async (blob: Blob | null) => {
        if (blob) {
          const formData = new FormData();
          formData.append('file', blob, name);
          await fetch('/api/save-drawing', {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          })
            .then(async (r) => {
              const response = await r.json();
              addToast({
                type: 'success',
                message: response.data.message,
              });
            })
            .catch((e: Error) => {
              addToast({
                type: 'error',
                message: e?.message,
              });
            });
          setShowPopUp(false);
        }
      });
    }
  }

  /**
   * Prepare the canvas on page load
   */
  useEffect(() => {
    const context = canvasRef?.current?.getContext('2d') || null;
    setCanvasCtx(context);
    clearCanvas(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCanvasCtx]);

  return (
    <div className={styles.paint}>
      <div className={styles.actions}>
        <span className={`${styles['actions-toggle']} ${!isToolbarOpen ? styles.collapsed : ''}`}>
          <Button type="primary-icon" onClick={toggleToolbar}>
            <MdKeyboardArrowLeft color="white" size={30} />
          </Button>
        </span>
        <div className={`${styles.toolbar} ${!isToolbarOpen ? styles.collapsed : ''}`}>
          <Button
            type="icon"
            highlighted={mode === Mode.DRAW}
            onClick={() => modeChange(Mode.DRAW)}
          >
            <RiPencilFill color="white" size="100%" />
          </Button>
          <Button
            type="icon"
            highlighted={mode === Mode.ERASE}
            onClick={() => modeChange(Mode.ERASE)}
          >
            <RiEraserFill color="white" size="100%" />
          </Button>
          <Button
            type="icon"
            highlighted={mode === Mode.FILL}
            onClick={() => modeChange(Mode.FILL)}
          >
            <RiPaintFill color="white" size="100%" />
          </Button>
        </div>
        <div className={`${styles.actionbar} ${!isToolbarOpen ? styles.collapsed : ''}`}>
          <Button type="icon" onClick={handeColorBtnClick} bgColor={selectedColor}>
            <input
              type="color"
              className={styles['color-palette']}
              onChange={handleColorChange}
              ref={colorPicker}
            />
            <RiPaletteLine color="white" size="100%" />
          </Button>
          <Button type="icon" onClick={undo}>
            <RiArrowGoBackFill color="white" size="100%" />
          </Button>
          <Button type="icon" onClick={redo}>
            <RiArrowGoForwardFill color="white" size="100%" />
          </Button>
          <Button type="icon" onClick={() => clearCanvas(canvasCtx)}>
            <RiDeleteBinLine color="white" size="100%" />
          </Button>
          <Button type="icon" onClick={() => setShowPopUp(true)}>
            <RiSave3Fill color="white" size="100%" />
          </Button>
        </div>
      </div>
      <div className={styles.board}>
        <canvas
          ref={canvasRef}
          onClick={(e) => draw(e.clientX, e.clientY, true)}
          onMouseMove={(e) => draw(e.clientX, e.clientY, false)}
          // onTouchMove={(e) => draw(e.clientX, e.clientY)}
          onMouseDown={() => setMovingActive(true)}
          onMouseUp={stopDrawing}
          width={GRID_SIZE}
          height={GRID_SIZE}
        />
        <div className={styles.examples}>
          {Array.from({ length: 6 }, (_, i) => (
            <Button
              type="icon"
              key={i}
              onClick={() => loadFromJson(`/assets/${i}_funksome.json`, canvasCtx)}
            >
              <NextImage
                src={`/assets/${i}_funksome.png`}
                alt={`Funksome example ${i}`}
                width={81.5}
                height={81.5}
              />
            </Button>
          ))}
        </div>
      </div>
      {showPopUp && (
        <PopUp
          title="Name the drawing"
          onSubmit={save}
          onClose={() => setShowPopUp(false)}
          submitDisabled={buttonDisabled}
        >
          <FormField
            type="text"
            name="name"
            label="Name"
            value={name}
            placeholder="Name of the drawing"
            maxLength={31}
            errorMsg={errorMsg}
            successMsg=""
            onEnter={handleNameEnterKey}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
          />
        </PopUp>
      )}
    </div>
  );
}
