import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const ItemTypes = {
  CARD: "card",
};

const DraggableCard = ({ id, title, content, index, moveCard }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(drop(ref));

  return (
    <Card ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const [cards, setCards] = useState([
    { id: "widget-1", title: "Total Users", content: "1000" },
    { id: "widget-2", title: "Active Users", content: "800" },
    { id: "widget-3", title: "Live Users", content: "300" },
    // Add more cards as needed
  ]);

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      const updatedCards = [...cards];
      updatedCards.splice(dragIndex, 1);
      updatedCards.splice(hoverIndex, 0, dragCard);
      setCards(updatedCards);
    },
    [cards]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <DraggableCard
              id={card.id}
              index={index}
              title={card.title}
              content={card.content}
              moveCard={moveCard}
            />
          </Grid>
        ))}
      </Grid>
    </DndProvider>
  );
};

export default Dashboard;
