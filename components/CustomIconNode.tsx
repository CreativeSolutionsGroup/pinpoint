"use client";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Ensure you have this icon installed
import { IconButton, TextField } from "@mui/material";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as LucideIcons from "lucide-react";
import { IconItem } from "@/components/Legend";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

//stores custom icons the user chooses
export const customIcons: Array<{
  icon: LucideIcons.LucideIcon;
  label: string;
}> = [];

export default function CustomIconAccordion() {
  const [filteredIcons, setFilteredIcons] = useState<
    Array<{ icon: LucideIcons.LucideIcon; label: string }>
  >([]);

  function handleSearchIcons(input: string) {
    //empty the filtered list of icons
    setFilteredIcons(() => {
      const newFilteredIcons = [];
      for (const [key, Icon] of Object.entries(LucideIcons)) {
        if (key.toLowerCase().includes(input.toLowerCase())) {
          newFilteredIcons.push({
            icon: Icon as LucideIcons.LucideIcon,
            label: key,
          });
        }
      }
      return newFilteredIcons;
    });
    console.log(filteredIcons);
  }

  return (
    <AccordionItem key="custom-icons" value="custom-icons">
      <AccordionTrigger>Custom Icons</AccordionTrigger>
      <AccordionContent>
        {/* pool of "custom" icons we store in the database /}
              {/ <div className="grid grid-cols-3 gap-2">
                {category.items.map((item, index) => (
                  <IconItem key={index} icon={item[1]} label={item[0]} />
                ))}
              </div> */}
        <Dialog>
          <DialogTrigger asChild>
            <IconButton>
              <AddCircleIcon />
            </IconButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Custom Icon</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <TextField
                label="Search Icons"
                variant="outlined"
                size="medium"
                onChange={(e) => handleSearchIcons(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 p-4 overflow-y-auto max-h-96">
              {filteredIcons.map((item, index) => (
                <IconItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  //FIXME IconItem isn't clickable currently
                  // onClick={() => handleIconSelect(item)}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </AccordionContent>
    </AccordionItem>
  );
}
