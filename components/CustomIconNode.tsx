"use client";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Ensure you have this icon installed
import {IconButton, TextField} from "@mui/material";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as LucideIcons from "lucide-react";
import {IconItem} from "@/components/Legend";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


//stores custom icons the user chooses
export const customIcons: Array<{ icon: LucideIcons.LucideIcon; label: string}> = [];

//temporary storage for filtered icons we want to render
let filteredIcons: Array<{ icon: LucideIcons.LucideIcon; label: string }> = [];

function handleIconSelect( ) {
//clear the filtered icons

//add the selected icon to custom icons

}
function handleSearchIcons(input: string) {
  //empty the filtered list of icons
  filteredIcons = [];
  for (const [key, Icon] of Object.entries(LucideIcons)) {
    if (key.toLowerCase().includes(input.toLowerCase())) {
      filteredIcons.push({ icon: Icon as LucideIcons.LucideIcon, label: key });
    }
  }
  console.log(filteredIcons);
}

export default function CustomIconAccordion(){
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
                        <AddCircleIcon/>
                        </IconButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a Custom Icon</DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                          <TextField label="Search Icons"
                          variant="outlined"
                          size="medium"
                          onChange={(e) => handleSearchIcons(e.target.value)}/>
                        </div>
                        <div>
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
